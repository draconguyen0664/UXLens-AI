import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { analyzeInterfaces } from "@/lib/ai/analyze";
import { AiMalformedResponseError, AiProviderError, AiTimeoutError } from "@/lib/ai/errors";
import { createClient } from "@/lib/supabase/server";
import { createSignedScreenshotUrl, deleteScreenshots, uploadScreenshots } from "@/lib/storage/screenshots";
import { multiAnalysisSchema } from "@/lib/validations/analysis";

export const runtime = "nodejs";
export const maxDuration = 60;
const FREE_LIMIT = 3;
const attempts=new Map<string,{count:number;reset:number}>();
function rateLimited(id:string){const now=Date.now();const current=attempts.get(id);if(!current||current.reset<now){attempts.set(id,{count:1,reset:now+60_000});return false}current.count+=1;return current.count>5}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Bạn cần đăng nhập để tạo audit" }, { status: 401 });
  if(rateLimited(user.id))return NextResponse.json({error:"Bạn thao tác quá nhanh. Vui lòng thử lại sau một phút.",code:"RATE_LIMITED"},{status:429});

  let paths: string[] = [];
  let auditId: string | undefined;

  try {
    const period = new Date().toISOString().slice(0, 7);
    const [{ data: usage }, { data: subscription }] = await Promise.all([
      supabase.from("usage").select("audit_count").eq("user_id", user.id).eq("period", period).maybeSingle(),
      supabase.from("subscriptions").select("status,plan,current_period_end").eq("user_id", user.id).maybeSingle(),
    ]);
    const pro = Boolean(subscription && ["active", "trialing"].includes(subscription.status) && subscription.plan !== "free" && (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date()));
    if (!pro && (usage?.audit_count ?? 0) >= FREE_LIMIT) {
      return NextResponse.json({ error: "Bạn đã dùng hết 3 audit miễn phí trong tháng.", code: "QUOTA_EXCEEDED" }, { status: 402 });
    }

    const form = await request.formData();
    const images = form.getAll("images").filter((item): item is File => item instanceof File);
    const fallback = form.get("image");
    if (!images.length && fallback instanceof File) images.push(fallback);
    const input = multiAnalysisSchema.parse({
      images, context: form.get("context") || undefined, productType: form.get("productType") || undefined,
      platform: form.get("platform") || undefined, screenType: form.get("screenType") || undefined,
      projectId: form.get("projectId") || undefined,
    });

    let projectId = input.projectId;
    if (projectId) {
      const { data: owned } = await supabase.from("projects").select("id").eq("id", projectId).eq("user_id", user.id).maybeSingle();
      if (!owned) return NextResponse.json({ error: "Project không tồn tại hoặc không thuộc tài khoản này" }, { status: 404 });
    } else {
      const { data: existing } = await supabase.from("projects").select("id").eq("user_id", user.id).order("created_at").limit(1).maybeSingle();
      if (existing) projectId = existing.id;
      else {
        const { data: created, error } = await supabase.from("projects").insert({ user_id: user.id, name: "Dự án mặc định" }).select("id").single();
        if (error) throw error;
        projectId = created.id;
      }
    }
    if (!projectId) throw new Error("Không thể xác định project");

    const { data: audit, error: createError } = await supabase.from("audits").insert({
      user_id: user.id, project_id: projectId, status: "pending", context: input.context,
      product_type: input.productType, platform: input.platform, screen_type: input.screenType,
    }).select("id").single();
    if (createError) throw createError;
    auditId = audit.id;

    paths = await uploadScreenshots(supabase, user.id, projectId, input.images);
    const { error: processingError } = await supabase.from("audits").update({
      image_path: paths[0], image_paths: paths, status: "processing", updated_at: new Date().toISOString(),
    }).eq("id", auditId).eq("user_id", user.id);
    if (processingError) throw processingError;

    const aiContext = [`Product type: ${input.productType ?? "general"}`, `Platform: ${input.platform ?? "web"}`, `Screen type: ${input.screenType ?? "other"}`, input.context].filter(Boolean).join(". ");
    const result = await analyzeInterfaces(input.images, aiContext);

    const { error: issuesError } = await supabase.from("audit_issues").insert(result.issues.map((issue, position) => ({
      audit_id: auditId, user_id: user.id, position, severity: issue.severity, category: issue.category,
      title: issue.title, location: issue.location, problem: issue.problem,
      why_it_matters: issue.whyItMatters, recommendation: issue.recommendation,
    })));
    if (issuesError) throw issuesError;

    const { error: completeError } = await supabase.from("audits").update({
      overall_score: result.overallScore, scores: result.categoryScores, status: "completed",
      error_message: null, updated_at: new Date().toISOString(),
    }).eq("id", auditId).eq("user_id", user.id);
    if (completeError) throw completeError;

    const { error: usageError } = await supabase.rpc("consume_audit_usage", { target_user_id: user.id });
    if (usageError) throw usageError;

    const signedUrls = await Promise.all(paths.map((path) => createSignedScreenshotUrl(supabase, user.id, path, 300)));
    return NextResponse.json({ auditId, isFirstAudit:(usage?.audit_count??0)===0, imagePath: paths[0], imagePaths: paths, signedUrls, promptVersion: "ux-audit-v1", ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã có lỗi xảy ra";
    if (auditId) {
      await supabase.from("audit_issues").delete().eq("audit_id", auditId).eq("user_id", user.id);
      await supabase.from("audits").update({ status: "failed", error_message: message.slice(0, 500), overall_score: null, scores: {}, updated_at: new Date().toISOString() }).eq("id", auditId).eq("user_id", user.id);
    }
    if (paths.length) await deleteScreenshots(supabase, user.id, paths).catch(() => undefined);
    if (error instanceof ZodError) return NextResponse.json({ error: "Dữ liệu audit không hợp lệ", details: error.flatten() }, { status: 422 });
    if (error instanceof AiTimeoutError) return NextResponse.json({ error: error.message, auditId }, { status: 504 });
    if (error instanceof AiMalformedResponseError || error instanceof AiProviderError) return NextResponse.json({ error: error.message, auditId }, { status: 502 });
    if (message.includes("free_quota_exceeded")) return NextResponse.json({ error: "Bạn đã dùng hết 3 audit miễn phí trong tháng.", code: "QUOTA_EXCEEDED" }, { status: 402 });
    return NextResponse.json({ error: message, auditId }, { status: 400 });
  }
}

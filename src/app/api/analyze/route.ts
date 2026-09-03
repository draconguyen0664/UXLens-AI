import { NextResponse } from "next/server";
import { analyzeInterface } from "@/lib/ai/analyze";
import { createClient } from "@/lib/supabase/server";
import { analysisSchema } from "@/lib/validations/analysis";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Bạn cần đăng nhập để tạo audit" }, { status: 401 });
  let imagePath: string | undefined;
  try {
    const form = await request.formData();
    const input = analysisSchema.parse({ image: form.get("image"), context: form.get("context") || undefined, projectId: form.get("projectId") || undefined });
    let projectId = input.projectId;
    if (!projectId) {
      const { data: existing } = await supabase.from("projects").select("id").eq("user_id", user.id).order("created_at").limit(1).maybeSingle();
      if (existing) projectId = existing.id;
      else {
        const { data: created, error } = await supabase.from("projects").insert({ user_id: user.id, name: "Dự án mặc định" }).select("id").single();
        if (error) throw error;
        projectId = created.id;
      }
    }
    const extension = input.image.name.split(".").pop()?.toLowerCase() || "png";
    imagePath = `${user.id}/${projectId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("screenshots").upload(imagePath, input.image, { contentType: input.image.type, upsert: false });
    if (uploadError) throw uploadError;
    const result = await analyzeInterface(input.image, input.context);
    const { data: audit, error: auditError } = await supabase.from("audits").insert({ user_id: user.id, project_id: projectId, image_path: imagePath, context: input.context, overall_score: result.overallScore, scores: result.scores, status: "completed" }).select("id").single();
    if (auditError) throw auditError;
    const { error: issuesError } = await supabase.from("audit_issues").insert(result.issues.map((issue, position) => ({ audit_id: audit.id, user_id: user.id, position, severity: issue.severity, category: issue.category, title: issue.title, problem: issue.problem, why_it_matters: issue.whyItMatters, recommendation: issue.recommendation })));
    if (issuesError) throw issuesError;
    await supabase.rpc("increment_audit_usage", { target_user_id: user.id });
    return NextResponse.json({ auditId: audit.id, imagePath, ...result });
  } catch (error) {
    if (imagePath) await supabase.storage.from("screenshots").remove([imagePath]);
    const message = error instanceof Error ? error.message : "Đã có lỗi xảy ra";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

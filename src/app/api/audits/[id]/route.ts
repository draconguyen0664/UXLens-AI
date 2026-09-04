import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteScreenshots } from "@/lib/storage/screenshots";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: audit } = await supabase.from("audits").select("image_paths,image_path").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!audit) return NextResponse.json({ error: "Không tìm thấy audit" }, { status: 404 });
  const paths = audit.image_paths?.length ? audit.image_paths : audit.image_path ? [audit.image_path] : [];
  const { error } = await supabase.from("audits").delete().eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (paths.length) await deleteScreenshots(supabase, user.id, paths).catch(() => undefined);
  return NextResponse.json({ ok: true });
}

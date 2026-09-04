import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSignedScreenshotUrl, deleteScreenshots } from "@/lib/storage/screenshots";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get("path");
    if (!path) return NextResponse.json({ error: "Thiếu screenshot path" }, { status: 400 });
    const signedUrl = await createSignedScreenshotUrl(supabase, user.id, path, Number(url.searchParams.get("expiresIn") ?? 300));
    return NextResponse.json({ signedUrl, expiresIn: Math.min(Math.max(Number(url.searchParams.get("expiresIn") ?? 300), 60), 3600) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tạo signed URL" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json() as { paths?: string[] };
    if (!body.paths?.length || body.paths.length > 20) return NextResponse.json({ error: "Danh sách paths không hợp lệ" }, { status: 400 });
    await deleteScreenshots(supabase, user.id, body.paths);
    return NextResponse.json({ deleted: body.paths.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể xóa screenshot" }, { status: 400 });
  }
}

import type { SupabaseClient } from "@supabase/supabase-js";
const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const SCREENSHOT_BUCKET = "screenshots";
export function assertOwnedPath(path: string, userId: string) { if (!path.startsWith(`${userId}/`) || path.includes("..")) throw new Error("Screenshot path không hợp lệ"); }
export async function uploadScreenshots(client: SupabaseClient, userId: string, projectId: string, files: File[]) {
  const uploaded: string[] = [];
  try { for (const file of files) { const extension=extensions[file.type]; if(!extension)throw new Error("Định dạng ảnh không được hỗ trợ"); const path=`${userId}/${projectId}/${crypto.randomUUID()}.${extension}`; const {error}=await client.storage.from(SCREENSHOT_BUCKET).upload(path,file,{contentType:file.type,cacheControl:"3600",upsert:false}); if(error)throw error; uploaded.push(path); } return uploaded; }
  catch(error) { if(uploaded.length)await client.storage.from(SCREENSHOT_BUCKET).remove(uploaded); throw error; }
}
export async function deleteScreenshots(client: SupabaseClient, userId: string, paths: string[]) { paths.forEach(path=>assertOwnedPath(path,userId)); const {error}=await client.storage.from(SCREENSHOT_BUCKET).remove(paths); if(error)throw error; }
export async function createSignedScreenshotUrl(client: SupabaseClient, userId: string, path: string, expiresIn = 300) { assertOwnedPath(path,userId); const {data,error}=await client.storage.from(SCREENSHOT_BUCKET).createSignedUrl(path,Math.min(Math.max(expiresIn,60),3600)); if(error)throw error; return data.signedUrl; }

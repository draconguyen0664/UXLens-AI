import { NewAuditForm } from "@/features/audit/components/new-audit-form";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function NewAuditPage({searchParams}:{searchParams:Promise<{projectId?:string;reopen?:string}>}){
  const params=await searchParams;
  let initial:{projectId?:string|null;goal?:string;productType?:string;platform?:string;screenType?:string}={projectId:params.projectId??null};
  if(params.reopen&&isSupabaseConfigured()){
    const supabase=await createClient();
    const{data}=await supabase.from("audits").select("project_id,context,product_type,platform,screen_type").eq("id",params.reopen).maybeSingle();
    if(data)initial={projectId:data.project_id,goal:data.context??"",productType:data.product_type??"general",platform:data.platform??"web",screenType:data.screen_type??"dashboard"};
  }
  return <div className="mx-auto max-w-6xl"><header className="mb-8"><p className="text-sm font-medium text-primary">{params.reopen?"Audit lại":"New Audit"}</p><h1 className="mt-1 text-3xl font-bold">{params.reopen?"Tạo phiên bản audit mới":"Phân tích screenshot mới"}</h1><p className="mt-2 text-muted-foreground">{params.reopen?"Bối cảnh cũ đã được giữ lại. Tải screenshot phiên bản mới để soát lại.":"Tải giao diện và cung cấp bối cảnh để nhận kết quả chính xác hơn."}</p></header><NewAuditForm initial={initial}/></div>
}

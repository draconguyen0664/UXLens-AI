import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AuditListItem } from "@/features/audit/components/audit-history";

const demo:AuditListItem[]=[
  {id:"demo",title:"Dashboard audit",project:"UXLens Demo",projectId:"demo-project",status:"completed",score:80,createdAt:new Date().toISOString()},
  {id:"demo-processing",title:"Mobile onboarding",project:"UXLens Demo",projectId:"demo-project",status:"processing",score:null,createdAt:new Date(Date.now()-86400000).toISOString()},
  {id:"demo-failed",title:"Checkout flow",project:"Client Portal",projectId:"client-project",status:"failed",score:null,createdAt:new Date(Date.now()-172800000).toISOString(),error:"AI provider tạm thời không phản hồi"},
];

export async function getAudits(projectId?:string):Promise<AuditListItem[]>{
  if(!isSupabaseConfigured())return projectId?demo.filter(a=>a.projectId===projectId):demo;
  const supabase=await createClient();const{data:{user}}=await supabase.auth.getUser();if(!user)return[];
  let query=supabase.from("audits").select("id,project_id,status,overall_score,context,screen_type,error_message,created_at,projects(name)").eq("user_id",user.id).order("created_at",{ascending:false});
  if(projectId)query=query.eq("project_id",projectId);
  const{data}=await query;
  const rows=(data??[]) as unknown as Array<{id:string;project_id:string;status:AuditListItem["status"];overall_score:number|null;context:string|null;screen_type:string|null;error_message:string|null;created_at:string;projects:{name:string}|null}>;return rows.map(row=>({id:row.id,projectId:row.project_id,project:row.projects?.name??"Dự án",title:row.context||`${row.screen_type??"Interface"} audit`,status:row.status,score:row.overall_score,createdAt:row.created_at,error:row.error_message}));
}

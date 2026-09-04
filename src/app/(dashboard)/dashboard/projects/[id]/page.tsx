import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditHistory } from "@/features/audit/components/audit-history";
import { getAudits } from "@/lib/dashboard-data";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function ProjectDetailPage({params}:{params:Promise<{id:string}>}){
  const{id}=await params;
  let name=id==="client-project"?"Client Portal":"UXLens Demo";
  if(isSupabaseConfigured()){const supabase=await createClient();const{data}=await supabase.from("projects").select("name").eq("id",id).maybeSingle();if(data)name=data.name}
  const audits=await getAudits(id);
  return <div className="mx-auto max-w-6xl"><Button asChild variant="ghost" className="-ml-3"><Link href="/dashboard/projects"><ArrowLeft className="mr-2 size-4"/>Dự án</Link></Button><h1 className="mt-4 text-3xl font-bold">{name}</h1><p className="mb-8 mt-2 text-muted-foreground">{audits.length} audit trong dự án này.</p><AuditHistory initialAudits={audits} projectId={id}/></div>
}

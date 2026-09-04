import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { Card,CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
export default async function ProjectsPage(){
 let projects=[{id:"demo-project",name:"UXLens Demo",audits:2,updated:new Date().toISOString()},{id:"client-project",name:"Client Portal",audits:1,updated:new Date(Date.now()-86400000).toISOString()}];
 if(isSupabaseConfigured()){const supabase=await createClient();const{data:{user}}=await supabase.auth.getUser();if(user){const{data}=await supabase.from("projects").select("id,name,updated_at,audits(count)").eq("user_id",user.id).order("updated_at",{ascending:false});const rows=(data??[]) as unknown as Array<{id:string;name:string;updated_at:string;audits:Array<{count:number}>}>;projects=rows.map(p=>({id:p.id,name:p.name,audits:p.audits?.[0]?.count??0,updated:p.updated_at}))}}
 return <div className="mx-auto max-w-6xl"><h1 className="text-3xl font-bold">Dự án</h1><p className="mb-8 mt-2 text-muted-foreground">Projects → Project Detail → Audits.</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{projects.map(project=><Link key={project.id} href={`/dashboard/projects/${project.id}`}><Card className="h-full transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"><CardContent className="p-5"><span className="grid size-10 place-items-center rounded-md bg-primary/10"><FolderKanban className="size-5 text-primary"/></span><h2 className="mt-5 font-semibold">{project.name}</h2><p className="mt-1 text-sm text-muted-foreground">{project.audits} audit · cập nhật {new Date(project.updated).toLocaleDateString("vi-VN")}</p></CardContent></Card></Link>)}</div></div>
}

"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpDown, ExternalLink, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type AuditListItem = { id: string; title: string; project: string; projectId: string; status: "pending"|"processing"|"completed"|"failed"; score: number|null; createdAt: string; error?: string|null };
const statusLabel={pending:"Đang chờ",processing:"Đang xử lý",completed:"Hoàn thành",failed:"Thất bại"};
const statusStyle={pending:"bg-slate-500/10 text-slate-600",processing:"bg-violet-500/10 text-violet-600",completed:"bg-emerald-500/10 text-emerald-600",failed:"bg-red-500/10 text-red-600"};

export function AuditHistory({ initialAudits, projectId }: { initialAudits: AuditListItem[]; projectId?: string }) {
  const [audits,setAudits]=useState(initialAudits); const[query,setQuery]=useState(""); const[status,setStatus]=useState("all"); const[descending,setDescending]=useState(true);
  const shown=useMemo(()=>audits.filter(a=>(status==="all"||a.status===status)&&(`${a.title} ${a.project}`.toLowerCase().includes(query.toLowerCase()))).sort((a,b)=>(new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())*(descending?1:-1)),[audits,query,status,descending]);
  async function remove(id:string){if(!confirm("Xóa audit và toàn bộ screenshot liên quan?"))return;const response=await fetch(`/api/audits/${id}`,{method:"DELETE"});if(response.ok)setAudits(list=>list.filter(a=>a.id!==id))}
  return <div>
    <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_180px_auto]"><div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm theo audit hoặc project..." className="pl-9"/></div><select value={status} onChange={e=>setStatus(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="all">Tất cả trạng thái</option><option value="pending">Đang chờ</option><option value="processing">Đang xử lý</option><option value="completed">Hoàn thành</option><option value="failed">Thất bại</option></select><Button variant="outline" onClick={()=>setDescending(v=>!v)}><ArrowUpDown className="mr-2 size-4"/>{descending?"Mới nhất":"Cũ nhất"}</Button></div>
    <div className="overflow-hidden rounded-lg border bg-card">{shown.length?shown.map(a=><div key={a.id} className="grid gap-3 border-b p-4 last:border-0 sm:grid-cols-[1fr_130px_90px_auto] sm:items-center"><div><p className="font-medium">{a.title}</p><p className="mt-1 text-xs text-muted-foreground">{a.project} · {new Date(a.createdAt).toLocaleString("vi-VN")}</p>{a.error&&<p className="mt-1 text-xs text-red-600">{a.error}</p>}</div><span className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[a.status]}`}>{statusLabel[a.status]}</span><span className="font-semibold">{a.score===null?"—":`${a.score}/100`}</span><div className="flex justify-end gap-1">{a.status==="completed"&&<Button asChild size="sm" variant="ghost"><Link href={`/dashboard/audits/${a.id}`}><ExternalLink className="mr-1 size-4"/>Mở</Link></Button>}<Button asChild size="sm" variant="ghost"><Link href={`/dashboard/new?reopen=${a.id}`}>Audit lại</Link></Button><Button size="sm" variant="ghost" onClick={()=>void remove(a.id)} aria-label="Xóa audit"><Trash2 className="size-4 text-destructive"/></Button></div></div>):<p className="p-12 text-center text-sm text-muted-foreground">Không có audit phù hợp bộ lọc.</p>}</div>
    {projectId&&<Button asChild className="mt-5"><Link href={`/dashboard/new?projectId=${projectId}`}>Tạo audit trong project</Link></Button>}
  </div>
}

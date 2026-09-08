import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditHistory } from "@/features/audit/components/audit-history";
import { getAudits } from "@/lib/dashboard-data";

export default async function AuditsPage(){
  const audits=await getAudits();
  return <div className="mx-auto max-w-6xl">
    <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><h1 className="text-3xl font-bold">Audits</h1><p className="mt-2 text-muted-foreground">Tìm kiếm, lọc, sắp xếp, mở lại hoặc xóa các lần phân tích.</p></div>
      <Button asChild><Link href="/dashboard/new"><Plus className="mr-2 size-4"/>New Audit</Link></Button>
    </header>
    <AuditHistory initialAudits={audits}/>
  </div>
}

import { AuditHistory } from "@/features/audit/components/audit-history";
import { getAudits } from "@/lib/dashboard-data";
export default async function AuditsPage(){const audits=await getAudits();return <div className="mx-auto max-w-6xl"><h1 className="text-3xl font-bold">Lịch sử audit</h1><p className="mb-8 mt-2 text-muted-foreground">Tìm kiếm, lọc, sắp xếp, mở lại hoặc xóa các lần phân tích.</p><AuditHistory initialAudits={audits}/></div>}

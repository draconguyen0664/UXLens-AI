import { FileSearch } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
export default function AuditsPage(){return <div className="mx-auto max-w-6xl"><h1 className="text-3xl font-bold">Audits</h1><p className="mb-8 mt-2 text-muted-foreground">Tất cả báo cáo UX của bạn.</p><EmptyState icon={FileSearch} title="Chưa có audit nào trong bộ lọc này" description="Tạo audit đầu tiên để bắt đầu theo dõi chất lượng UX." action="Tạo New Audit" href="/dashboard/new"/></div>;}

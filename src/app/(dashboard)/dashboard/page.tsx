import { AnalysisForm } from "@/components/analysis-form";
export const metadata = { title: "Dashboard" };
export default function DashboardPage() { return <div><header className="mb-8"><p className="text-sm font-medium text-primary">Design intelligence</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Audit giao diện</h1><p className="mt-2 text-muted-foreground">Tải screenshot và nhận báo cáo UX có cấu trúc, được lưu theo dự án.</p></header><AnalysisForm/></div>; }

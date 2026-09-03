import { FolderKanban } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
export default function ProjectsPage(){return <div className="mx-auto max-w-6xl"><h1 className="text-3xl font-bold">Dự án</h1><p className="mb-8 mt-2 text-muted-foreground">Nhóm các audit theo sản phẩm hoặc khách hàng.</p><EmptyState icon={FolderKanban} title="Chưa có dự án" description="Dự án mặc định sẽ được tạo khi bạn hoàn thành audit đầu tiên." action="Tạo audit" href="/dashboard/new"/></div>;}

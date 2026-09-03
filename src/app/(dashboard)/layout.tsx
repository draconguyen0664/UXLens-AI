import Link from "next/link";
import { redirect } from "next/navigation";
import { Eye, FolderKanban, Gauge, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <div className="min-h-screen bg-muted/20"><header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur"><div className="flex h-16 items-center justify-between px-5"><Link href="/dashboard" className="flex items-center gap-2 font-bold"><Eye className="text-primary"/>UXLens AI</Link><div className="flex items-center gap-3"><span className="hidden text-sm text-muted-foreground sm:block">{user.email}</span><ThemeToggle/></div></div></header><div className="mx-auto grid max-w-7xl md:grid-cols-[220px_1fr]"><aside className="hidden min-h-[calc(100vh-4rem)] border-r p-4 md:block"><nav className="space-y-1"><Link className="flex items-center gap-3 rounded-md bg-accent px-3 py-2 text-sm font-medium" href="/dashboard"><Gauge className="size-4"/>Tổng quan</Link><span className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground"><FolderKanban className="size-4"/>Dự án</span><span className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground"><Settings className="size-4"/>Cài đặt</span></nav></aside><main className="min-w-0 p-5 sm:p-8">{children}</main></div></div>;
}

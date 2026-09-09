import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  let email = (await cookies()).get("uxlens_demo_session")?.value ?? "demo@uxlens.ai";
  if (configured) { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login"); email = user.email ?? "UXLens user"; }
  return <DashboardShell email={email}>{children}</DashboardShell>;
}
import Link from "next/link";
import { cookies } from "next/headers";
import { CreditCard, Mail, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Tài khoản" };

export default async function AccountPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  let email = (await cookies()).get("uxlens_demo_session")?.value ?? "demo@uxlens.ai";
  let fullName = "UXLens User";

  if (configured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    email = user?.email ?? email;
    fullName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? fullName;
  }

  return <div className="mx-auto max-w-4xl space-y-6"><header><p className="text-sm font-medium text-primary">Hồ sơ cá nhân</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Tài khoản</h1><p className="mt-2 text-muted-foreground">Thông tin đăng nhập và gói sử dụng của bạn.</p></header><div className="grid gap-6 md:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><User className="size-4 text-primary"/>Thông tin tài khoản</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center gap-3 rounded-md border p-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10"><User className="size-4 text-primary"/></span><div className="min-w-0"><p className="truncate text-sm font-semibold">{fullName}</p><p className="truncate text-xs text-muted-foreground">Thành viên UXLens AI</p></div></div><div className="flex items-center gap-3"><Mail className="size-4 text-muted-foreground"/><div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{email}</p></div></div><Button asChild variant="outline" className="w-full"><Link href="/forgot-password"><ShieldCheck className="mr-2 size-4"/>Đổi mật khẩu</Link></Button></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><CreditCard className="size-4 text-primary"/>Gói hiện tại</CardTitle></CardHeader><CardContent><div className="rounded-md bg-primary/5 p-4"><p className="text-xs font-medium uppercase tracking-wider text-primary">Free</p><p className="mt-2 text-2xl font-bold">3 audits<span className="text-sm font-normal text-muted-foreground"> / tháng</span></p></div><p className="my-4 text-sm text-muted-foreground">Quản lý lượt audit, thanh toán và nâng cấp gói của bạn.</p><Button asChild className="w-full"><Link href="/dashboard/billing">Quản lý gói</Link></Button></CardContent></Card></div></div>;
}
import Link from "next/link";
import { CreditCard, LockKeyhole, Palette, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const metadata = { title: "Cài đặt" };

export default function SettingsPage() {
  return <div className="mx-auto max-w-4xl space-y-6"><header><p className="text-sm font-medium text-primary">Tuỳ chỉnh workspace</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Cài đặt</h1><p className="mt-2 text-muted-foreground">Quản lý giao diện, bảo mật và thanh toán.</p></header><div className="grid gap-6 md:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Palette className="size-4 text-primary"/>Giao diện</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between rounded-md border p-4"><div><p className="text-sm font-medium">Chế độ hiển thị</p><p className="mt-1 text-xs text-muted-foreground">Chuyển nhanh giữa light và dark mode.</p></div><ThemeToggle/></div></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Settings className="size-4 text-primary"/>Quản lý</CardTitle></CardHeader><CardContent className="space-y-3"><Button asChild variant="outline" className="w-full justify-start"><Link href="/forgot-password"><LockKeyhole className="mr-2 size-4"/>Đổi mật khẩu</Link></Button><Button asChild variant="outline" className="w-full justify-start"><Link href="/dashboard/billing"><CreditCard className="mr-2 size-4"/>Cài đặt thanh toán</Link></Button></CardContent></Card></div></div>;
}
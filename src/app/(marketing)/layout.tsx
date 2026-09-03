import Link from "next/link";
import { Eye } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <><header className="fixed inset-x-0 top-0 z-40 border-b bg-background/80 backdrop-blur"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"><Link href="/" className="flex items-center gap-2 font-bold"><Eye className="text-primary"/>UXLens AI</Link><nav className="flex items-center gap-2"><ThemeToggle/><Link href="/login" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Đăng nhập</Link></nav></div></header>{children}</>;
}

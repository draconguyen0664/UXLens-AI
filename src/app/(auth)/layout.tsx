import Link from "next/link";
import { Eye } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
export default function AuthLayout({ children }: { children: React.ReactNode }) { return <div className="min-h-screen bg-muted/30"><header className="flex h-16 items-center justify-between px-5"><Link href="/" className="flex items-center gap-2 font-bold"><Eye className="text-primary"/>UXLens AI</Link><ThemeToggle/></header>{children}</div>; }

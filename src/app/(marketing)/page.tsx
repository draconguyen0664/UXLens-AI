import Link from "next/link";
import { ArrowRight, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketingPage() {
  return <main className="grid-glow min-h-screen pt-16"><section className="mx-auto max-w-6xl px-5 py-24 text-center sm:py-32"><Badge variant="outline">AI-powered UX audit</Badge><h1 className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-bold tracking-tight sm:text-7xl">Biến screenshot thành quyết định UX rõ ràng.</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">UXLens phân tích usability, accessibility, hierarchy, consistency và UX writing trong vài giây.</p><Button asChild size="lg" className="mt-8"><Link href="/dashboard">Bắt đầu audit <ArrowRight className="ml-2 size-4"/></Link></Button><div className="mt-20 grid gap-4 text-left sm:grid-cols-3">{[[ScanSearch,"Phân tích có cấu trúc","Điểm số và issue được ưu tiên rõ ràng."],[Sparkles,"Đề xuất hành động","Không chỉ chỉ ra lỗi, AI giải thích cách sửa."],[ShieldCheck,"Dữ liệu riêng tư","Screenshot nằm trong private Supabase bucket."]].map(([Icon,title,text]) => <Card key={String(title)}><CardHeader><Icon className="size-6 text-primary"/><CardTitle className="pt-3">{String(title)}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{String(text)}</CardContent></Card>)}</div></section></main>;
}

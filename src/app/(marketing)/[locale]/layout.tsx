import Link from "next/link";
import { Eye } from "lucide-react";
import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitch } from "@/components/language-switch";
import { Button } from "@/components/ui/button";
import { FunnelEvent } from "@/components/funnel-event";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales } from "@/lib/i18n/config";
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function MarketingLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: value } = await params; if (!isLocale(value)) notFound(); const t = getDictionary(value);
  return <><FunnelEvent name="landing_view"/><header className="fixed inset-x-0 top-0 z-40 border-b bg-background/80 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"><Link href={`/${value}`} className="flex items-center gap-2 font-bold"><Eye className="text-primary"/>UXLens AI</Link><nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex"><Link className="hover:text-foreground" href="#features">{t.nav.features}</Link><Link className="hover:text-foreground" href="#how-it-works">{t.nav.how}</Link><Link className="hover:text-foreground" href="#pricing">{t.nav.pricing}</Link><Link className="hover:text-foreground" href="#faq">{t.nav.faq}</Link></nav><div className="flex items-center gap-2"><LanguageSwitch locale={value}/><ThemeToggle/><Button asChild size="sm"><Link href={`/login?locale=${value}`}>{t.nav.login}</Link></Button></div></div></header>{children}</>;
}
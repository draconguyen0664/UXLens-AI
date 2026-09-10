import { notFound } from "next/navigation";
import { FunnelEvent } from "@/components/funnel-event";
import { MarketingNavbar } from "@/features/marketing/components/marketing-navbar";
import { isLocale, locales } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function MarketingLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <><FunnelEvent name="landing_view"/><MarketingNavbar locale={locale}/>{children}</>;
}
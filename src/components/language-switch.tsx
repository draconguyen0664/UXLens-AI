"use client";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale: Locale = locale === "vi" ? "en" : "vi";
  function changeLocale() {
    document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000;samesite=lax`;
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.push(segments.join("/") || `/${nextLocale}`);
  }
  return <button type="button" onClick={changeLocale} aria-label={locale === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"} className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-background px-2.5 text-xs font-semibold transition hover:border-primary/50"><Languages className="size-3.5"/>{nextLocale.toUpperCase()}</button>;
}

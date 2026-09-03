import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
export default async function LocaleRedirect() { const store = await cookies(); const saved = store.get("NEXT_LOCALE")?.value; redirect(`/${saved && isLocale(saved) ? saved : defaultLocale}`); }

import Link from "next/link";
import { notFound } from "next/navigation";
import { Accessibility, ArrowRight, BarChart3, BrainCircuit, Check, CheckCircle2, Eye, FileSearch, Layers3, ListChecks, MousePointerClick, Palette, ScanSearch, ShieldCheck, UploadCloud, Users, WandSparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingMotion } from "@/features/marketing/components/marketing-motion";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale } from "@/lib/i18n/config";
const featureIcons = [ScanSearch, BrainCircuit, ListChecks, Accessibility, BarChart3, ShieldCheck];
const caseIcons = [Palette, MousePointerClick, Layers3, Users];
const howIcons = [UploadCloud, BrainCircuit, FileSearch];
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return { title: locale === "en" ? "AI UX audits from screenshots" : "Audit UX bằng AI từ screenshot", description: locale === "en" ? "Find usability and accessibility issues in seconds." : "Phát hiện vấn đề usability và accessibility trong vài giây." }; }
export default async function MarketingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const dashboard = `/dashboard?locale=${locale}`;
  const hero = locale === "vi" ? {
    badge: "Mới",
    release: "Say Hello to UXLens AI v1.0",
    before: "Audit mọi dashboard tức thì ",
    italic: "và",
    after: " tạo ra trải nghiệm tốt hơn",
    description: "Tải screenshot lên để AI phát hiện vấn đề usability, accessibility, visual hierarchy và nhận đề xuất cải thiện rõ ràng chỉ trong vài phút.",
    primary: "Đặt lịch demo miễn phí",
    secondary: "Bắt đầu ngay",
  } : {
    badge: "New",
    release: "Say Hello to UXLens AI v1.0",
    before: "Audit every dashboard instantly ",
    italic: "and",
    after: " build better experiences",
    description: "Upload any dashboard screenshot and let AI uncover usability, accessibility, and visual hierarchy issues with clear, actionable recommendations.",
    primary: "Book a Free Demo",
    secondary: "Get Started Now",
  };
  return <MarketingMotion><main className="min-h-screen">
    <section id="home" className="relative flex min-h-screen overflow-hidden bg-[#2b2344] px-6 pb-16 pt-24 sm:pt-28 lg:px-[120px]">
      <video className="absolute inset-0 size-full object-cover" autoPlay loop muted playsInline preload="auto" aria-hidden="true">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4" type="video/mp4"/>
      </video>
      <div className="relative z-10 mx-auto mt-20 flex w-full max-w-6xl flex-col items-center justify-center text-center sm:mt-24 lg:mt-32">
        <div data-animate="eyebrow" className="flex h-[38px] items-center gap-2 rounded-[10px] border border-[rgba(164,132,215,.5)] bg-[rgba(85,80,110,.4)] px-2 pr-3 font-cabin text-sm font-medium text-white backdrop-blur-md">
          <span className="grid h-6 place-items-center rounded-md bg-[#7b39fc] px-2.5">{hero.badge}</span>
          <span>{hero.release}</span>
        </div>
        <h1 data-animate="title" className="mx-auto mt-7 max-w-[1100px] font-instrument text-5xl leading-[1.05] tracking-[-.025em] text-white [text-shadow:0_3px_22px_rgba(0,0,0,.22)] sm:text-7xl lg:text-[96px]">
          {hero.before}<em className="inline-block px-[.08em] font-normal">{hero.italic}</em>{hero.after}
        </h1>
        <p data-animate="description" className="mx-auto mt-6 max-w-[662px] font-inter text-base font-normal leading-7 text-white/70 [text-shadow:0_2px_16px_rgba(0,0,0,.25)] sm:text-lg">
          {hero.description}
        </p>
        <div data-animate="cta" className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link href={`/register?locale=${locale}`} className="w-full rounded-[10px] bg-[#7b39fc] px-6 py-3.5 font-cabin text-base font-medium text-white shadow-[0_10px_30px_rgba(123,57,252,.3)] transition hover:-translate-y-0.5 hover:bg-[#8b53fd] sm:w-auto">{hero.primary}</Link>
          <Link href={dashboard} className="w-full rounded-[10px] bg-[#2b2344] px-6 py-3.5 font-cabin text-base font-medium text-[#f6f7f9] shadow-[0_10px_30px_rgba(43,35,68,.25)] transition hover:-translate-y-0.5 hover:bg-[#3a3059] sm:w-auto">{hero.secondary}</Link>
        </div>
      </div>
    </section>
    <section id="reviews" data-reveal className="border-y bg-muted/30"><div className="mx-auto max-w-6xl px-5 py-9 text-center"><p className="text-xs font-medium uppercase tracking-[.2em] text-muted-foreground">{t.proof}</p><div className="marquee-mask mt-6 overflow-hidden"><div className="marquee-track flex w-max items-center gap-12 whitespace-nowrap text-sm font-semibold text-muted-foreground/70"><span>PRODUCT TEAMS</span><span>DESIGN STUDIOS</span><span>STARTUPS</span><span>AGENCIES</span><span>FREELANCERS</span><span>PRODUCT TEAMS</span><span>DESIGN STUDIOS</span><span>STARTUPS</span><span>AGENCIES</span><span>FREELANCERS</span></div></div></div></section>
    <section id="features" className="mx-auto max-w-6xl px-5 py-24 sm:py-32"><SectionIntro badge={t.features.badge} title={t.features.title} description={t.features.description}/><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{t.features.items.map(([title,text],i) => { const Icon=featureIcons[i]; return <Card data-reveal key={title} className="group transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"><CardHeader><span className="grid size-10 place-items-center rounded-lg bg-primary/10"><Icon className="size-5 text-primary"/></span><CardTitle className="pt-3">{title}</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-muted-foreground">{text}</CardContent></Card>; })}</div></section>
    <section id="how-it-works" className="border-y bg-muted/30"><div className="mx-auto max-w-6xl px-5 py-24 sm:py-32"><SectionIntro badge={t.how.badge} title={t.how.title}/><div className="mt-14 grid gap-8 md:grid-cols-3">{t.how.items.map(([title,text],i) => { const Icon=howIcons[i]; return <div data-reveal key={title}><span className="text-5xl font-bold text-primary/15">0{i+1}</span><Icon className="mt-3 size-6 text-primary"/><h3 className="mt-4 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>; })}</div></div></section>
    <section className="mx-auto max-w-6xl px-5 py-24 sm:py-32"><div data-reveal className="max-w-2xl"><Badge variant="secondary">{t.cases.badge}</Badge><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{t.cases.title}</h2></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{t.cases.items.map(([title,text],i) => { const Icon=caseIcons[i]; return <div data-reveal key={title} className="rounded-lg border p-5"><Icon className="size-5 text-primary"/><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>; })}</div></section>
    <section className="border-y bg-muted/30"><div className="mx-auto max-w-6xl px-5 py-24 sm:py-32"><SectionIntro badge={t.comparison.badge} title={t.comparison.title}/><div className="mt-12 grid gap-5 md:grid-cols-2"><Comparison title={t.comparison.before} items={t.comparison.beforeItems} positive={false}/><Comparison title={t.comparison.after} items={t.comparison.afterItems} positive/></div></div></section>
    <section id="pricing" className="mx-auto max-w-5xl px-5 py-24 sm:py-32"><SectionIntro badge={t.pricing.badge} title={t.pricing.title} description={t.pricing.description}/><div className="mx-auto mt-12 grid max-w-3xl gap-5 md:grid-cols-2"><PriceCard name="Free" price="$0" items={t.pricing.free} cta={t.pricing.freeCta} href={dashboard} month={t.pricing.month}/><PriceCard name="Pro" price="$9" items={t.pricing.pro} cta={t.pricing.proCta} href={dashboard} month={t.pricing.month} popular={t.pricing.popular}/></div></section>
    <section id="faq" className="border-y bg-muted/30"><div className="mx-auto max-w-3xl px-5 py-24 sm:py-32"><SectionIntro badge={t.faq.badge} title={t.faq.title}/><div className="mt-10 space-y-3">{t.faq.items.map(([q,a]) => <details data-reveal key={q} className="group rounded-lg border bg-card p-5"><summary className="cursor-pointer list-none font-medium">{q}<span className="float-right text-primary transition group-open:rotate-45">+</span></summary><p className="mt-3 text-sm leading-6 text-muted-foreground">{a}</p></details>)}</div></div></section>
    <section className="mx-auto max-w-6xl px-5 py-24"><div data-reveal className="relative overflow-hidden rounded-xl border bg-primary px-6 py-14 text-center text-primary-foreground shadow-2xl shadow-primary/20 sm:px-12"><WandSparkles className="mx-auto size-8"/><h2 className="mt-5 text-3xl font-bold sm:text-5xl">{t.cta.title}</h2><p className="mx-auto mt-4 max-w-xl opacity-80">{t.cta.description}</p><Button asChild size="lg" variant="outline" className="mt-8 border-white/30 bg-white text-violet-700 hover:bg-white/90"><Link href={dashboard}>{t.cta.button}<ArrowRight className="ml-2 size-4"/></Link></Button></div></section>
  </main><footer id="contact" className="border-t"><div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between"><Link href={`/${locale}`} className="flex items-center gap-2 font-bold"><Eye className="text-primary"/>UXLens AI</Link><div className="flex flex-wrap gap-5 text-sm text-muted-foreground"><Link href="#features">{t.nav.features}</Link><Link href="#pricing">{t.nav.pricing}</Link><Link href="#faq">FAQ</Link><span>{t.footer.privacy}</span><span>{t.footer.terms}</span></div><p className="text-xs text-muted-foreground">© 2026 UXLens AI</p></div></footer></MarketingMotion>;
}
function SectionIntro({ badge,title,description }: { badge:string; title:string; description?:string }) { return <div data-reveal className="mx-auto max-w-2xl text-center"><Badge variant="secondary">{badge}</Badge><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{title}</h2>{description && <p className="mt-4 text-muted-foreground">{description}</p>}</div>; }
function Comparison({ title,items,positive }: { title:string; items:readonly string[]; positive:boolean }) { const Icon=positive?Check:X; return <Card data-reveal className={positive?"border-primary/30 shadow-lg shadow-primary/5":"border-destructive/25"}><CardHeader><div className="flex items-center gap-2">{positive?<CheckCircle2 className="size-5 text-primary"/>:<X className="size-5 text-destructive"/>}<CardTitle>{title}</CardTitle></div></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground">{items.map(x=><p key={x} className="flex gap-2"><Icon className={positive?"mt-0.5 size-4 shrink-0 text-primary":"mt-0.5 size-4 shrink-0 text-destructive/70"}/>{x}</p>)}</CardContent></Card>; }
function PriceCard({name,price,items,cta,href,month,popular}:{name:string;price:string;items:readonly string[];cta:string;href:string;month:string;popular?:string}) { return <Card data-reveal className={popular?"relative border-primary shadow-xl shadow-primary/10":""}>{popular&&<Badge className="absolute right-4 top-4">{popular}</Badge>}<CardHeader><CardTitle>{name}</CardTitle><div className="pt-3"><span className="text-4xl font-bold">{price}</span><span className="text-muted-foreground"> {month}</span></div></CardHeader><CardContent><ul className="space-y-3">{items.map(x=><li key={x} className="flex gap-2 text-sm"><Check className="size-4 text-primary"/>{x}</li>)}</ul><Button asChild variant={popular?"default":"outline"} className="mt-8 w-full"><Link href={href}>{cta}</Link></Button></CardContent></Card>; }
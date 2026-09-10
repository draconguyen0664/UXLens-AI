"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function MarketingNavbar({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const vi = locale === "vi";
  const links = [
    [vi ? "Trang chủ" : "Home", `/${locale}#home`],
    [vi ? "Dịch vụ" : "Services", `/${locale}#features`],
    [vi ? "Đánh giá" : "Reviews", `/${locale}#reviews`],
    [vi ? "Liên hệ" : "Contact us", `/${locale}#contact`],
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return <header className="absolute inset-x-0 top-0 z-20 px-6 py-4 lg:px-[120px]"><div className="flex items-center"><Link href={`/${locale}`} aria-label="UXLens AI home" className="relative z-30 shrink-0"><Image src="/brand/uxlens-ai-logo-dark.png" alt="UXLens AI" width={2172} height={724} priority className="h-8 w-auto"/></Link><nav className="ml-12 hidden items-center gap-8 md:flex" aria-label="Main navigation">{links.map(([label,href],index)=><Link key={label} href={href} className="flex items-center gap-1 font-manrope text-sm font-medium text-white transition-opacity hover:opacity-80">{label}{index===1&&<ChevronDown className="size-3.5"/>}</Link>)}</nav><div className="ml-auto hidden items-center gap-3 md:flex"><Link href={`/login?locale=${locale}`} className="rounded-lg border border-[#d4d4d4] bg-white px-5 py-2.5 font-manrope text-sm font-semibold text-[#171717] transition hover:bg-white/90">{vi?"Đăng nhập":"Sign In"}</Link><Link href={`/register?locale=${locale}`} className="rounded-lg bg-[#7b39fc] px-5 py-2.5 font-manrope text-sm font-semibold text-[#fafafa] shadow-[0_8px_24px_rgba(123,57,252,.3)] transition hover:bg-[#8b53fd]">{vi?"Bắt đầu":"Get Started"}</Link></div><button type="button" aria-label={open?"Đóng menu":"Mở menu"} aria-expanded={open} aria-controls="mobile-marketing-menu" onClick={()=>setOpen(value=>!value)} className="relative z-30 ml-auto grid size-10 place-items-center text-white md:hidden">{open?<X className="size-6"/>:<Menu className="size-6"/>}</button></div>{open&&<div id="mobile-marketing-menu" className="fixed inset-0 z-20 flex min-h-dvh flex-col bg-black px-6 pb-8 pt-24 md:hidden"><nav className="flex flex-1 flex-col justify-center gap-2" aria-label="Mobile navigation">{links.map(([label,href],index)=><Link key={label} href={href} onClick={()=>setOpen(false)} className="flex items-center justify-between border-b border-white/15 py-5 font-instrument text-4xl text-white"><span>{label}</span>{index===1&&<ChevronDown className="size-5"/>}</Link>)}</nav><div className="grid gap-3"><Link href={`/login?locale=${locale}`} onClick={()=>setOpen(false)} className="rounded-lg border border-white/25 bg-white px-5 py-3.5 text-center font-manrope text-sm font-semibold text-black">{vi?"Đăng nhập":"Sign In"}</Link><Link href={`/register?locale=${locale}`} onClick={()=>setOpen(false)} className="rounded-lg bg-[#7b39fc] px-5 py-3.5 text-center font-manrope text-sm font-semibold text-white">{vi?"Bắt đầu":"Get Started"}</Link></div></div>}</header>;
}

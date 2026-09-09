"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3,ChevronDown,CreditCard,FileSearch,FolderKanban,Gauge,Menu,Settings,Sparkles,User,X } from "lucide-react";
import { signOut } from "@/app/(auth)/login/actions";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DashboardMotion } from "@/features/dashboard/components/dashboard-motion";
import { cn } from "@/lib/utils";

const nav=[
  {href:"/dashboard",label:"Tổng quan",icon:Gauge},
  {href:"/dashboard/audits",label:"Audits",icon:FileSearch},
  {href:"/dashboard/projects",label:"Dự án",icon:FolderKanban},
  {href:"/dashboard/usage",label:"Sử dụng",icon:BarChart3},
  {href:"/dashboard/billing",label:"Billing",icon:CreditCard},
];

export function DashboardShell({children,email}:{children:React.ReactNode;email:string}){
  const pathname=usePathname();
  const[mobileOpen,setMobileOpen]=useState(false);
  const isActive=(href:string)=>href==="/dashboard"?pathname===href:href==="/dashboard/audits"?pathname.startsWith(href)||pathname.startsWith("/dashboard/new"):pathname.startsWith(href);
  return <div className="dashboard-motion-bg min-h-screen bg-muted/20">
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6">
        <Button variant="ghost" size="sm" className="-ml-2 lg:hidden" aria-label={mobileOpen?"Đóng điều hướng":"Mở điều hướng"} aria-expanded={mobileOpen} onClick={()=>setMobileOpen(value=>!value)}>{mobileOpen?<X className="size-5"/>:<Menu className="size-5"/>}</Button>
        <Link href="/dashboard" aria-label="UXLens AI dashboard"><BrandLogo compact/></Link>
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Dashboard navigation">
          {nav.map(({href,label,icon:Icon})=><Link key={href} href={href} aria-current={isActive(href)?"page":undefined} className={cn("group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",isActive(href)?"bg-primary/10 text-primary":"text-muted-foreground hover:bg-accent hover:text-foreground")}><Icon className="size-4 transition-transform group-hover:scale-110"/>{label}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <Button asChild size="sm" className="hidden gap-2 xl:flex"><Link href="/pricing"><Sparkles className="size-4"/>Nâng cấp</Link></Button>
          <ThemeToggle/>
          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="gap-2 px-2"><span className="grid size-8 place-items-center rounded-full bg-primary/10"><User className="size-4 text-primary"/></span><span className="hidden max-w-36 truncate text-sm sm:block">{email}</span><ChevronDown className="hidden size-3.5 text-muted-foreground sm:block"/></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem><User className="mr-2 size-4"/>Tài khoản</DropdownMenuItem><DropdownMenuItem><Settings className="mr-2 size-4"/>Cài đặt</DropdownMenuItem><DropdownMenuSeparator/><form action={signOut}><DropdownMenuItem asChild><button type="submit" className="w-full">Đăng xuất</button></DropdownMenuItem></form></DropdownMenuContent></DropdownMenu>
        </div>
      </div>
      {mobileOpen&&<div className="border-t bg-background/95 p-3 shadow-lg backdrop-blur-xl lg:hidden"><nav className="mx-auto grid max-w-[1440px] grid-cols-2 gap-2" aria-label="Mobile dashboard navigation">{nav.map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={()=>setMobileOpen(false)} aria-current={isActive(href)?"page":undefined} className={cn("flex items-center gap-2 rounded-md border p-3 text-sm font-medium",isActive(href)?"border-primary/30 bg-primary/10 text-primary":"text-muted-foreground")}><Icon className="size-4"/>{label}</Link>)}<Link href="/pricing" onClick={()=>setMobileOpen(false)} className="col-span-2 flex items-center justify-center gap-2 rounded-md bg-primary p-3 text-sm font-medium text-primary-foreground"><Sparkles className="size-4"/>Nâng cấp Pro</Link></nav></div>}
    </header>
    <main className="mx-auto min-w-0 max-w-[1440px] p-4 sm:p-6 lg:p-8"><DashboardMotion>{children}</DashboardMotion></main>
  </div>
}

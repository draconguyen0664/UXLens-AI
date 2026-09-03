"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useRef } from "react";
gsap.registerPlugin(useGSAP);
export function DashboardMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null); const pathname = usePathname();
  useGSAP(() => {
    gsap.from("[data-dashboard-page] > *", { opacity: 0, y: 22, duration: .55, stagger: .09, ease: "power3.out", clearProps: "transform" });
    gsap.from("[data-stat-card]", { opacity: 0, y: 18, scale: .96, duration: .5, stagger: .1, ease: "back.out(1.4)" });
    gsap.to("[data-stat-card]", { y: -7, duration: 1.6, stagger: .18, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to("[data-upgrade-card]", { boxShadow: "0 0 32px hsl(var(--primary) / .24)", duration: 1.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }, { scope, dependencies: [pathname], revertOnUpdate: true });
  return <div ref={scope} data-dashboard-page>{children}</div>;
}

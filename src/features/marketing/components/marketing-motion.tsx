"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function MarketingMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const cursorGlow = useRef<HTMLDivElement>(null);
  useGSAP(() => {

    gsap.timeline({ defaults: { ease: "power3.out" } }).from("[data-animate='eyebrow']", { opacity: 0, y: 14, duration: .45 }).from("[data-animate='title']", { opacity: 0, y: 40, rotateX: 8, duration: .8 }, "-=.2").from("[data-animate='description']", { opacity: 0, y: 20, duration: .55 }, "-=.4").from("[data-animate='cta']", { opacity: 0, y: 16, scale: .96, duration: .45 }, "-=.3").from("[data-animate='preview']", { opacity: 0, y: 60, scale: .94, rotateX: 8, duration: .9 }, "-=.2");
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => gsap.from(element, { opacity: 0, y: 42, scale: .985, duration: .75, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } }));
    gsap.to(progress.current, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .15 } });
    gsap.to("[data-animate='eyebrow']", { y: -12, scale: 1.04, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to("[data-preview] > div", { y: -18, rotateZ: .35, duration: 2.1, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to("[data-animate='cta'] svg", { x: 5, duration: .75, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to("[data-orb='one']", { xPercent: 18, yPercent: -12, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to("[data-orb='two']", { xPercent: -16, yPercent: 18, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to("[data-orb='three']", { rotate: 360, duration: 28, repeat: -1, ease: "none" });
    gsap.utils.toArray<HTMLElement>("section").forEach((section, index) => { if (index === 0) return; gsap.fromTo(section, { backgroundPositionY: "0px" }, { backgroundPositionY: "80px", ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 } }); });
    const preview = scope.current?.querySelector<HTMLElement>("[data-preview]");
    const onPreviewMove = (event: MouseEvent) => { if (!preview || window.innerWidth < 768) return; const box=preview.getBoundingClientRect(); const x=(event.clientX-box.left)/box.width-.5; const y=(event.clientY-box.top)/box.height-.5; gsap.to(preview,{rotateY:x*5,rotateX:y*-5,duration:.5,ease:"power2.out",transformPerspective:1000}); };
    const onPreviewLeave = () => preview && gsap.to(preview,{rotateX:0,rotateY:0,duration:.7,ease:"elastic.out(1,.5)"});
    preview?.addEventListener("mousemove",onPreviewMove); preview?.addEventListener("mouseleave",onPreviewLeave);
    const moveX=gsap.quickTo(cursorGlow.current,"x",{duration:.8,ease:"power3"}); const moveY=gsap.quickTo(cursorGlow.current,"y",{duration:.8,ease:"power3"});
    const onPointerMove=(event:PointerEvent)=>{ if(event.pointerType!=="touch"){ moveX(event.clientX); moveY(event.clientY); }}; window.addEventListener("pointermove",onPointerMove);
    return () => { preview?.removeEventListener("mousemove",onPreviewMove); preview?.removeEventListener("mouseleave",onPreviewLeave); window.removeEventListener("pointermove",onPointerMove); };
  }, { scope });
  return <div ref={scope} className="relative isolate overflow-hidden"><div ref={progress} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-primary"/><div ref={cursorGlow} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[-1] hidden size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl md:block"/>{children}</div>;
}
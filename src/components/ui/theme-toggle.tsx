"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";

  return (
    <button type="button" role="switch" aria-checked={dark} aria-label={dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"} onClick={() => setTheme(dark ? "light" : "dark")} className="relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border bg-muted p-1 shadow-inner transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      <span className={cn("absolute left-1 top-1 size-6 rounded-full bg-background shadow-md ring-1 ring-border transition-transform duration-200", dark ? "translate-x-6" : "translate-x-0")} />
      <span className="relative z-10 grid size-6 place-items-center"><Sun className={cn("size-3.5 transition-colors", dark ? "text-muted-foreground" : "text-amber-500")} aria-hidden="true" /></span>
      <span className="relative z-10 grid size-6 place-items-center"><Moon className={cn("size-3.5 transition-colors", dark ? "text-violet-400" : "text-muted-foreground")} aria-hidden="true" /></span>
    </button>
  );
}
"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
export function ThemeToggle() { const { resolvedTheme, setTheme } = useTheme(); return <Button variant="ghost" size="sm" aria-label="Đổi giao diện sáng tối" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>{resolvedTheme === "dark" ? <Sun className="size-4"/> : <Moon className="size-4"/>}</Button>; }

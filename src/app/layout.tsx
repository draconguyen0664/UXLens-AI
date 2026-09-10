import type { Metadata } from "next";
import { AppProvider } from "@/providers/app-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "UXLens AI", template: "%s · UXLens AI" },
  description: "AI-powered interface analysis and UX feedback.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" suppressHydrationWarning><body className="font-sans"><ThemeProvider><AppProvider>{children}</AppProvider></ThemeProvider></body></html>;
}
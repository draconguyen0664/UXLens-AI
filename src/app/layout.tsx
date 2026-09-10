import type { Metadata } from "next";
import { Cabin, Instrument_Serif, Inter, Manrope } from "next/font/google";
import { AppProvider } from "@/providers/app-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin", "vietnamese"], variable: "--font-manrope" });
const cabin = Cabin({ subsets: ["latin", "vietnamese"], variable: "--font-cabin" });
const instrument = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-instrument" });

export const metadata: Metadata = {
  title: { default: "UXLens AI", template: "%s · UXLens AI" },
  description: "AI-powered interface analysis and UX feedback.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" suppressHydrationWarning><body className={`${inter.variable} ${manrope.variable} ${cabin.variable} ${instrument.variable} font-inter`}><ThemeProvider><AppProvider>{children}</AppProvider></ThemeProvider></body></html>;
}
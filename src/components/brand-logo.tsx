import Image from "next/image";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return <span className="flex items-center rounded-md bg-white px-1.5 py-1 shadow-sm ring-1 ring-black/5">
    <Image src="/brand/uxlens-ai-logo.png" alt="UXLens AI — See a brighter tomorrow" width={2172} height={724} priority className={compact ? "h-7 w-auto" : "h-8 w-auto"}/>
  </span>;
}

import Image from "next/image";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  const sizeClass = compact ? "h-7 w-auto" : "h-8 w-auto";

  return (
    <span className="flex items-center">
      <Image src="/brand/uxlens-ai-logo.png" alt="UXLens AI — See a brighter tomorrow" width={2172} height={724} priority className={`${sizeClass} dark:hidden`}/>
      <Image src="/brand/uxlens-ai-logo-dark.png" alt="UXLens AI — See a brighter tomorrow" width={2172} height={724} priority className={`${sizeClass} hidden dark:block`}/>
    </span>
  );
}
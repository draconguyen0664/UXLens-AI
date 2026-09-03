import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export function EmptyState({ icon: Icon, title, description, action, href }: { icon: LucideIcon; title: string; description: string; action?: string; href?: string }) { return <div className="grid min-h-80 place-items-center rounded-lg border border-dashed bg-card p-8 text-center"><div><span className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10"><Icon className="size-5 text-primary"/></span><h2 className="mt-4 font-semibold">{title}</h2><p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>{action&&href&&<Button asChild className="mt-5"><Link href={href}>{action}</Link></Button>}</div></div>; }

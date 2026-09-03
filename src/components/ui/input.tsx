import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("flex h-10 w-full rounded-md border bg-muted/40 px-3 py-2 text-sm outline-none file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary", className)} {...props} />
));
Input.displayName = "Input";

"use client";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import * as React from "react";
import { cn } from "@/lib/utils";
export const DropdownMenu = DropdownPrimitive.Root; export const DropdownMenuTrigger = DropdownPrimitive.Trigger;
export const DropdownMenuContent = React.forwardRef<React.ElementRef<typeof DropdownPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>>(({ className, sideOffset = 4, ...props }, ref) => <DropdownPrimitive.Portal><DropdownPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn("z-50 min-w-40 rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props}/></DropdownPrimitive.Portal>); DropdownMenuContent.displayName = "DropdownMenuContent";
export const DropdownMenuItem = React.forwardRef<React.ElementRef<typeof DropdownPrimitive.Item>, React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Item>>(({ className, ...props }, ref) => <DropdownPrimitive.Item ref={ref} className={cn("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent", className)} {...props}/>); DropdownMenuItem.displayName = "DropdownMenuItem";
export const DropdownMenuSeparator = DropdownPrimitive.Separator;

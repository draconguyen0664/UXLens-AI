"use client";
import { useEffect } from "react";
import { capture,type FunnelEvent } from "@/lib/analytics";
export function FunnelEvent({name,properties}:{name:FunnelEvent;properties?:Record<string,unknown>}){useEffect(()=>capture(name,properties),[name,properties]);return null}

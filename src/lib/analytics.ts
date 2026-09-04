import posthog from "posthog-js";
export type FunnelEvent="landing_view"|"signup"|"first_audit"|"audit_completed"|"credit_exhausted"|"pricing_view"|"upgrade_clicked"|"checkout_started"|"subscription_started"|"subscription_cancelled";
export function capture(event:FunnelEvent,properties?:Record<string,unknown>){if(typeof window!=="undefined"&&process.env.NEXT_PUBLIC_POSTHOG_KEY)posthog.capture(event,properties)}

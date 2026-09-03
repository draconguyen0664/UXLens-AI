"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } }));
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (key) posthog.init(key, { api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST, capture_pageview: true, person_profiles: "identified_only" });
  }, []);
  return <QueryClientProvider client={client}>{children}<Toaster theme="dark" richColors /></QueryClientProvider>;
}

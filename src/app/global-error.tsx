"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { Sentry.captureException(error); }, [error]);
  return (
    <html lang="vi" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <main className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Đã có lỗi xảy ra</h1>
          <p className="mt-3 text-slate-400">Sự cố đã được ghi nhận. Bạn có thể thử tải lại phần này.</p>
          <button onClick={reset} className="mt-6 rounded-md bg-cyan-400 px-4 py-2 font-medium text-slate-950">Thử lại</button>
        </main>
      </body>
    </html>
  );
}

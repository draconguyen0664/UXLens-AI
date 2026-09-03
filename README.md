# UXLens AI

Starter SaaS phân tích UX từ screenshot, sử dụng Next.js 15, TypeScript, Tailwind/shadcn, Zustand, TanStack Query, React Hook Form/Zod, Supabase, OpenAI, PostHog và Sentry.

## Chạy local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`. Endpoint kiểm tra hệ thống: `GET /api/health`.

## Thiết lập dịch vụ

1. Tạo Supabase project, điền URL/anon key và chạy `supabase/migrations/0001_initial.sql` trong SQL Editor.
2. Điền `OPENAI_API_KEY` để bật phân tích ảnh thật.
3. Điền PostHog/Sentry keys nếu cần telemetry. Khi bỏ trống, ứng dụng vẫn chạy và tự tắt các integration này.
4. Payment keys đã được định nghĩa trong `.env.example`; webhook/checkout nên được triển khai khi đã chốt Stripe hay Lemon Squeezy.
5. Import repository lên GitHub và kết nối Vercel; copy toàn bộ biến môi trường tương ứng vào project settings.

## Kiểm tra

```bash
npm run typecheck
npm run build
```

Không commit `.env.local` hoặc service-role secrets.

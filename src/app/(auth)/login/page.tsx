import { Eye } from "lucide-react";
import { signIn } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const params = await searchParams;
  return <main className="grid min-h-screen place-items-center px-5"><form action={signIn} className="w-full max-w-sm rounded-2xl border bg-slate-950 p-6"><div className="mb-6 flex items-center gap-2 text-xl font-bold"><Eye className="text-cyan-400"/>UXLens AI</div><h1 className="text-2xl font-semibold">Đăng nhập</h1><p className="mb-5 mt-2 text-sm text-slate-400">Nhận magic link qua email, không cần mật khẩu.</p>{params.sent && <p className="mb-4 text-sm text-cyan-400">Đã gửi link đăng nhập. Hãy kiểm tra email.</p>}{params.error && <p className="mb-4 text-sm text-red-400">{params.error}</p>}<Input name="email" type="email" required placeholder="you@company.com"/><Button className="mt-4 w-full">Gửi magic link</Button></form></main>;
}

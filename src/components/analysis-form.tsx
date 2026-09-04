"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Loader2, ScanSearch, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { analysisResultSchema, analysisSchema, type AnalysisInput, type AnalysisResult } from "@/lib/validations/analysis";
import { useAnalysisStore } from "@/store/use-analysis-store";

type AuditResponse = AnalysisResult & { auditId: string; imagePath: string };
async function analyze(values: AnalysisInput): Promise<AuditResponse> {
  const body = new FormData(); body.append("image", values.image); body.append("context", values.context ?? "");
  const response = await fetch("/api/analyze", { method: "POST", body });
  if (!response.ok) throw new Error((await response.json()).error ?? "Không thể phân tích ảnh");
  return analysisResultSchema.parse(await response.json()) as AuditResponse;
}

const labels: Record<keyof AnalysisResult["categoryScores"], string> = { usability: "Usability", accessibility: "Accessibility", visualHierarchy: "Hierarchy", consistency: "Consistency", uxWriting: "UX Writing" };
const severityStyle = { critical: "text-red-400 border-red-500/30", major: "text-orange-400 border-orange-500/30", minor: "text-amber-400 border-amber-500/30" };

export function AnalysisForm() {
  const { imagePreview, setImagePreview } = useAnalysisStore();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AnalysisInput>({ resolver: zodResolver(analysisSchema) });
  const mutation = useMutation({ mutationFn: analyze, onSuccess: () => toast.success("Audit đã được lưu"), onError: (error) => toast.error(error.message) });
  const image = watch("image");
  useEffect(() => { if (!image) return; const url = URL.createObjectURL(image); setImagePreview(url); return () => URL.revokeObjectURL(url); }, [image, setImagePreview]);
  const chartData = mutation.data ? Object.entries(mutation.data.categoryScores).map(([key, value]) => ({ subject: labels[key as keyof AnalysisResult["categoryScores"]], score: value })) : [];

  return <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
    <form onSubmit={handleSubmit((value) => mutation.mutate(value))} className="h-fit rounded-2xl border bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20">
      <label className="group flex min-h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-700 bg-slate-900/60 hover:border-cyan-500">
        {imagePreview ? <Image src={imagePreview} alt="Ảnh giao diện xem trước" width={960} height={640} unoptimized className="max-h-80 w-full object-contain" /> : <><ImagePlus className="mb-4 size-10 text-cyan-400"/><span className="font-medium">Thả hoặc chọn ảnh giao diện</span><span className="mt-2 text-sm text-slate-400">PNG, JPG, WebP · tối đa 8 MB</span></>}
        <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" {...register("image")} />
      </label>
      {errors.image && <p className="mt-2 text-sm text-red-400">{errors.image.message}</p>}
      <Input className="mt-4" placeholder="Bối cảnh sản phẩm (không bắt buộc)" {...register("context")} />
      <Button className="mt-4 w-full" size="lg" disabled={mutation.isPending}>{mutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin"/> : <ScanSearch className="mr-2 size-4"/>}{mutation.isPending ? "Đang phân tích..." : "Phân tích UX"}</Button>
    </form>
    <section className="rounded-2xl border bg-slate-950/70 p-6">
      <div className="mb-5 flex items-center gap-2"><Sparkles className="size-5 text-cyan-400"/><h2 className="font-semibold">Kết quả audit</h2></div>
      {!mutation.data ? <p className="text-sm leading-6 text-slate-400">Đăng nhập, tải screenshot và nhận điểm số có cấu trúc cùng các vấn đề được ưu tiên.</p> : <div className="space-y-5">
        <div className="grid items-center sm:grid-cols-[110px_1fr]"><div><span className="text-5xl font-bold text-cyan-400">{mutation.data.overallScore}</span><span className="text-slate-400">/100</span></div><div className="h-48"><ResponsiveContainer width="100%" height="100%"><RadarChart data={chartData}><PolarGrid stroke="#334155"/><PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10 }}/><Radar dataKey="score" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.25}/></RadarChart></ResponsiveContainer></div></div>
        {mutation.data.issues.map((item, index) => <article key={index} className={`rounded-lg border bg-slate-900/70 p-4 ${severityStyle[item.severity]}`}><div className="mb-2 flex items-start justify-between gap-3"><h3 className="font-medium text-slate-100">{item.title}</h3><span className="text-xs font-semibold uppercase">{item.severity}</span></div><p className="text-sm text-slate-400">{item.problem}</p><p className="mt-2 text-sm"><strong className="text-slate-300">Đề xuất:</strong> <span className="text-slate-400">{item.recommendation}</span></p></article>)}
      </div>}
    </section>
  </div>;
}

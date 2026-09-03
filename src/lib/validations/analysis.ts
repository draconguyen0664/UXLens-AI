import { z } from "zod";

export const scoreSchema = z.object({ usability: z.number().int().min(0).max(100), accessibility: z.number().int().min(0).max(100), hierarchy: z.number().int().min(0).max(100), consistency: z.number().int().min(0).max(100), uxWriting: z.number().int().min(0).max(100) });
export const issueSchema = z.object({ severity: z.enum(["critical", "high", "medium", "low"]), category: z.enum(["usability", "accessibility", "hierarchy", "consistency", "uxWriting"]), title: z.string().min(1).max(160), problem: z.string().min(1).max(1000), whyItMatters: z.string().min(1).max(1000), recommendation: z.string().min(1).max(1000) });
export const analysisResultSchema = z.object({ overallScore: z.number().int().min(0).max(100), scores: scoreSchema, issues: z.array(issueSchema).min(1).max(20) });
export const analysisSchema = z.object({ image: z.custom<File>((value) => value instanceof File, "Vui lòng chọn ảnh").refine((file) => file.size <= 8 * 1024 * 1024, "Ảnh tối đa 8 MB").refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "Chỉ hỗ trợ JPG, PNG hoặc WebP"), context: z.string().trim().max(500).optional(), projectId: z.string().uuid().optional() });
export type AnalysisInput = z.infer<typeof analysisSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;

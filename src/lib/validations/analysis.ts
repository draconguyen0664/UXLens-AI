import { z } from "zod";

export const MAX_SCREENSHOT_SIZE = 8 * 1024 * 1024;
export const MAX_SCREENSHOTS = 5;
export const SCREENSHOT_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const imageFileSchema = z.instanceof(File)
  .refine((file) => SCREENSHOT_MIME_TYPES.includes(file.type as (typeof SCREENSHOT_MIME_TYPES)[number]), "Chỉ hỗ trợ PNG, JPG và WebP")
  .refine((file) => file.size <= MAX_SCREENSHOT_SIZE, "Mỗi ảnh phải nhỏ hơn 8 MB");

export const categoryScoresSchema = z.object({
  usability: z.number().int().min(0).max(100),
  accessibility: z.number().int().min(0).max(100),
  visualHierarchy: z.number().int().min(0).max(100),
  consistency: z.number().int().min(0).max(100),
  uxWriting: z.number().int().min(0).max(100),
}).strict();

export type CategoryScores = z.infer<typeof categoryScoresSchema>;

export function calculateOverallScore(scores: CategoryScores) {
  return Math.round(scores.usability * 0.3 + scores.accessibility * 0.2 + scores.visualHierarchy * 0.2 + scores.consistency * 0.15 + scores.uxWriting * 0.15);
}

export const issueSchema = z.object({
  severity: z.enum(["critical", "major", "minor"]),
  category: z.enum(["usability", "accessibility", "visualHierarchy", "consistency", "uxWriting"]),
  title: z.string().trim().min(1).max(160),
  location: z.string().trim().min(1).max(300),
  problem: z.string().trim().min(1).max(1000),
  whyItMatters: z.string().trim().min(1).max(1000),
  recommendation: z.string().trim().min(1).max(1000),
}).strict();

const rawAnalysisResultSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  categoryScores: categoryScoresSchema,
  issues: z.array(issueSchema).min(1).max(20),
}).strict();

export const analysisResultSchema = rawAnalysisResultSchema
  .superRefine((result, ctx) => {
    const expected = calculateOverallScore(result.categoryScores);
    if (Math.abs(result.overallScore - expected) > 5) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["overallScore"], message: `Overall score must match the weighted category score (${expected})` });
    }
  })
  .transform((result) => ({ ...result, overallScore: calculateOverallScore(result.categoryScores) }));

export const analysisSchema = z.object({ image: imageFileSchema, context: z.string().trim().max(500).optional() });
export const multiAnalysisSchema = z.object({
  images: z.array(imageFileSchema).min(1, "Cần ít nhất một screenshot").max(MAX_SCREENSHOTS, `Tối đa ${MAX_SCREENSHOTS} screenshots`),
  context: z.string().trim().max(500).optional(),
  productType: z.string().trim().max(80).optional(),
  platform: z.string().trim().max(40).optional(),
  screenType: z.string().trim().max(80).optional(),
  projectId: z.string().uuid().optional(),
});

export type AnalysisInput = z.infer<typeof analysisSchema>;
export type MultiAnalysisInput = z.infer<typeof multiAnalysisSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;

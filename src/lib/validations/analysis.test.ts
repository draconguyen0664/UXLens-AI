import { describe, expect, it } from "vitest";
import { buildUxAuditPrompt } from "../ai/prompts/ux-audit-v1";
import { analysisResultSchema, calculateOverallScore, MAX_SCREENSHOT_SIZE, multiAnalysisSchema } from "./analysis";

const screenshot = (name = "screen.png", type = "image/png", size = 16) =>
  new File([new Uint8Array(size)], name, { type });

const validResult = {
  overallScore: 78,
  categoryScores: { usability: 80, accessibility: 70, visualHierarchy: 90, consistency: 80, uxWriting: 80 },
  issues: [{
    severity: "major" as const,
    category: "visualHierarchy" as const,
    title: "Thứ bậc chưa rõ",
    location: "Khu vực trung tâm",
    problem: "Các thành phần có cùng độ nổi bật.",
    whyItMatters: "Người dùng khó biết nên đọc gì trước.",
    recommendation: "Tăng khác biệt về kích thước và khoảng trắng.",
  }],
};

describe("multi screenshot audit contract", () => {
  it("accepts a product flow containing five valid screenshots", () => {
    expect(multiAnalysisSchema.safeParse({ images: Array.from({ length: 5 }, (_, index) => screenshot(`screen-${index}.png`)) }).success).toBe(true);
  });

  it("rejects more than five screenshots", () => {
    expect(multiAnalysisSchema.safeParse({ images: Array.from({ length: 6 }, (_, index) => screenshot(`screen-${index}.png`)) }).success).toBe(false);
  });

  it("rejects unsupported MIME types and oversized files", () => {
    expect(multiAnalysisSchema.safeParse({ images: [screenshot("vector.svg", "image/svg+xml")] }).success).toBe(false);
    expect(multiAnalysisSchema.safeParse({ images: [screenshot("large.png", "image/png", MAX_SCREENSHOT_SIZE + 1)] }).success).toBe(false);
  });

  it("uses a deterministic weighted overall score", () => {
    expect(calculateOverallScore(validResult.categoryScores)).toBe(80);
    expect(analysisResultSchema.parse({ ...validResult, overallScore: 79 }).overallScore).toBe(80);
  });

  it("rejects legacy severities and scores that drift too far", () => {
    expect(analysisResultSchema.safeParse({ ...validResult, issues: [{ ...validResult.issues[0], severity: "high" }] }).success).toBe(false);
    expect(analysisResultSchema.safeParse({ ...validResult, overallScore: 50 }).success).toBe(false);
  });

  it("instructs the model to review screenshots consistently", () => {
    const prompt = buildUxAuditPrompt("SaaS onboarding", 3);
    expect(prompt).toContain("3 screenshots as one product flow");
    expect(prompt).toContain("Deduplicate repeated findings");
    expect(prompt).toContain("same visible evidence consistently");
    expect(prompt).toContain("SaaS onboarding");
  });
});

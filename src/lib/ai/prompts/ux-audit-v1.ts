const score = { type: "integer", minimum: 0, maximum: 100 } as const;

export const uxAuditJsonSchema = {
  name: "ux_audit_v1",
  strict: true,
  schema: {
    type: "object", additionalProperties: false,
    required: ["overallScore", "categoryScores", "issues"],
    properties: {
      overallScore: score,
      categoryScores: {
        type: "object", additionalProperties: false,
        required: ["usability", "accessibility", "visualHierarchy", "consistency", "uxWriting"],
        properties: { usability: score, accessibility: score, visualHierarchy: score, consistency: score, uxWriting: score },
      },
      issues: {
        type: "array", minItems: 1, maxItems: 20,
        items: {
          type: "object", additionalProperties: false,
          required: ["severity", "category", "title", "location", "problem", "whyItMatters", "recommendation"],
          properties: {
            severity: { type: "string", enum: ["critical", "major", "minor"] },
            category: { type: "string", enum: ["usability", "accessibility", "visualHierarchy", "consistency", "uxWriting"] },
            title: { type: "string" }, location: { type: "string" }, problem: { type: "string" },
            whyItMatters: { type: "string" }, recommendation: { type: "string" },
          },
        },
      },
    },
  },
} as const;

export function buildUxAuditPrompt(context: string | undefined, imageCount: number) {
  return `You are a senior UX auditor. Review ${imageCount} screenshot${imageCount > 1 ? "s" : ""} as one product flow.
Evaluate exactly five categories: usability, accessibility, visualHierarchy, consistency, and uxWriting.
Use visible evidence only. Do not invent product domain, prices, business rules, or user intent unless supplied in context.
Use this stable scoring rubric for every category: 90-100 excellent; 75-89 good with minor friction; 60-74 usable with material issues; 40-59 poor; 0-39 blocks core tasks.
Score the same visible evidence consistently. Do not change a score without a concrete visual reason.
Set overallScore to: round(usability*0.30 + accessibility*0.20 + visualHierarchy*0.20 + consistency*0.15 + uxWriting*0.15).
Severity must be critical (blocks a core task or creates serious accessibility risk), major (materially slows or confuses users), or minor (localized polish issue).
For every issue, provide its precise location, problem, user impact, and an actionable recommendation. Deduplicate repeated findings across screenshots.
Return only the required structured JSON. Write all textual fields in Vietnamese.${context ? `\nContext: ${context}` : ""}`;
}

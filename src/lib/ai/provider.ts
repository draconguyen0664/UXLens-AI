import type { AnalysisResult } from "@/lib/validations/analysis";
export type VisionAuditInput = { images: File[]; context?: string; timeoutMs?: number };
export interface VisionAuditProvider { analyze(input: VisionAuditInput): Promise<AnalysisResult>; }

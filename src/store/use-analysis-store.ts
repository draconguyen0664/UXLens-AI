import { create } from "zustand";
import type { AnalysisResult } from "@/lib/validations/analysis";
type AnalysisState = { imagePreview: string | null; fileName: string | null; platform: string; screenType: string; goal: string; result: AnalysisResult | null; setDraft: (draft: Partial<Omit<AnalysisState, "setDraft" | "reset">>) => void; setImagePreview: (value: string | null) => void; reset: () => void };
const initial = { imagePreview: null, fileName: null, platform: "web", screenType: "landing", goal: "", result: null };
export const useAnalysisStore = create<AnalysisState>((set) => ({ ...initial, setDraft: (draft) => set(draft), setImagePreview: (imagePreview) => set({ imagePreview }), reset: () => set(initial) }));
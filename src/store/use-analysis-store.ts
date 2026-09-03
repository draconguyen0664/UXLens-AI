import { create } from "zustand";

type AnalysisState = {
  imagePreview: string | null;
  setImagePreview: (value: string | null) => void;
  reset: () => void;
};

export const useAnalysisStore = create<AnalysisState>((set) => ({
  imagePreview: null,
  setImagePreview: (imagePreview) => set({ imagePreview }),
  reset: () => set({ imagePreview: null }),
}));

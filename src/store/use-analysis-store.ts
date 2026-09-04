import { create } from "zustand";
import type { AnalysisResult } from "@/lib/validations/analysis";
export type DraftScreenshot={name:string;preview:string;file:File};
type AnalysisState={imagePreview:string|null;fileName:string|null;screenshots:DraftScreenshot[];projectId:string|null;productType:string;platform:string;screenType:string;goal:string;result:AnalysisResult|null;setDraft:(draft:Partial<Omit<AnalysisState,"setDraft"|"reset">>)=>void;setImagePreview:(value:string|null)=>void;reset:()=>void};
const initial={imagePreview:null,fileName:null,screenshots:[] as DraftScreenshot[],projectId:null,productType:"general",platform:"web",screenType:"dashboard",goal:"",result:null};
export const useAnalysisStore=create<AnalysisState>(set=>({...initial,setDraft:draft=>set(draft),setImagePreview:imagePreview=>set({imagePreview}),reset:()=>set(initial)}));
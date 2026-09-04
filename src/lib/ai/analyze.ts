import { OpenAiVisionProvider } from "@/lib/ai/providers/openai";
import type { VisionAuditProvider } from "@/lib/ai/provider";
function getProvider():VisionAuditProvider { const provider=process.env.AI_PROVIDER??"openai"; if(provider!=="openai")throw new Error(`AI provider chưa được hỗ trợ: ${provider}`); const key=process.env.OPENAI_API_KEY; if(!key)throw new Error("OPENAI_API_KEY chưa được cấu hình"); return new OpenAiVisionProvider(key); }
export async function analyzeInterfaces(images:File[],context?:string){return getProvider().analyze({images,context,timeoutMs:Number(process.env.AI_TIMEOUT_MS??45_000)});}
export async function analyzeInterface(image:File,context?:string){return analyzeInterfaces([image],context);}
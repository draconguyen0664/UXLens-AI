import OpenAI from "openai";
import { ZodError } from "zod";
import { analysisResultSchema, type AnalysisResult } from "@/lib/validations/analysis";
import { AiMalformedResponseError, AiProviderError, AiTimeoutError } from "@/lib/ai/errors";
import type { VisionAuditInput, VisionAuditProvider } from "@/lib/ai/provider";
import { buildUxAuditPrompt, uxAuditJsonSchema } from "@/lib/ai/prompts/ux-audit-v1";

const MAX_FORMAT_ATTEMPTS = 3;

export class OpenAiVisionProvider implements VisionAuditProvider {
  private client: OpenAI;
  constructor(apiKey: string) { this.client = new OpenAI({ apiKey, maxRetries: 2 }); }

  async analyze({ images, context, timeoutMs = 45_000 }: VisionAuditInput): Promise<AnalysisResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const imageContent = await Promise.all(images.map(async (image) => ({
        type: "image_url" as const,
        image_url: { url: `data:${image.type};base64,${Buffer.from(await image.arrayBuffer()).toString("base64")}`, detail: "high" as const },
      })));

      for (let attempt = 1; attempt <= MAX_FORMAT_ATTEMPTS; attempt += 1) {
        const response = await this.client.chat.completions.create({
          model: process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini",
          temperature: 0,
          seed: 1701,
          response_format: { type: "json_schema", json_schema: uxAuditJsonSchema },
          messages: [{ role: "user", content: [{ type: "text", text: buildUxAuditPrompt(context, images.length) }, ...imageContent] }],
        }, { signal: controller.signal });

        const content = response.choices[0]?.message.content;
        try {
          if (!content) throw new SyntaxError("Empty AI response");
          return analysisResultSchema.parse(JSON.parse(content));
        } catch (error) {
          const malformed = error instanceof SyntaxError || error instanceof ZodError;
          if (!malformed) throw error;
          if (attempt === MAX_FORMAT_ATTEMPTS) throw new AiMalformedResponseError();
        }
      }
      throw new AiMalformedResponseError();
    } catch (error) {
      if (controller.signal.aborted) throw new AiTimeoutError();
      if (error instanceof AiProviderError || error instanceof AiMalformedResponseError) throw error;
      const message = error instanceof Error ? error.message : "Unknown provider error";
      throw new AiProviderError(`OpenAI Vision error: ${message}`);
    } finally {
      clearTimeout(timeout);
    }
  }
}

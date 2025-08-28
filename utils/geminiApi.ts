import { google } from "@ai-sdk/google";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateText } from "ai";

const GEMINI_API_KEY_STORAGE = "gemini-api-key";

export interface SummaryResult {
  id: string;
  url: string;
  title: string;
  summary: string;
  createdAt: number;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;

  private async initialize(): Promise<boolean> {
    const result = await browser.storage.local.get(GEMINI_API_KEY_STORAGE);
    const apiKey = result[GEMINI_API_KEY_STORAGE];
    if (!apiKey) {
      console.error("Gemini API key not found");
      return false;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    return true;
  }

  async summarizeContent(
    content: string,
    url: string,
    title: string,
  ): Promise<SummaryResult | null> {
    if (!this.genAI) {
      const initialized = await this.initialize();
      if (!initialized) {
        return null;
      }
    }

    try {
      const model = google("gemini-2.5-flash");

      const prompt =
        `以下のWebページの内容を日本語で簡潔に要約してください。重要なポイントを箇条書きでまとめ、最後に一段落の要約を追加してください。

タイトル: ${title}
URL: ${url}

内容:
${content}

要約:`;

      const { text, reasoning } = await generateText({
        model,
        prompt,
        providerOptions: {
          google: {
            thinkingConfig: {
              thinkingBudget: 8192,
              includeThoughts: true,
            },
          },
        },
      });

      const summaryResult: SummaryResult = {
        id: `summary-${Date.now()}`,
        url,
        title,
        summary: text,
        createdAt: Date.now(),
      };

      return summaryResult;
    } catch (error) {
      console.error("Failed to generate summary:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();

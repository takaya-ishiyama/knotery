import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY_STORAGE = "gemini-api-key";

const GEMINI_MODEL = "gemini-2.5-flash-lite";

const decryptApiKey = (encryptedKey: string): string => {
  return atob(encryptedKey);
};

export type SummaryResult = {
  id: string;
  url: string;
  title: string;
  summary: string;
  createdAt: number;
};

export const geminiInitialize = async (): Promise<GoogleGenAI> => {
  const result = await browser.storage.local.get(GEMINI_API_KEY_STORAGE);
  const apiKey = result[GEMINI_API_KEY_STORAGE];

  if (!apiKey) {
    throw new Error("Gemini API key not found");
  }

  const decryptedKey = decryptApiKey(result[GEMINI_API_KEY_STORAGE]);

  return new GoogleGenAI({ apiKey: decryptedKey });
};

export const summarizeContent = (ai: GoogleGenAI) =>
async (
  { url, title }: {
    url: string;
    title: string;
  },
): Promise<SummaryResult | undefined> => {
  if (!ai) {
    throw new Error("Gemini instance is not initialized");
  }
  try {
    // Google AI プロバイダーインスタンスを作成

    const prompt =
      `指定されたurlのWebページの内容を日本語で簡潔に要約してください。重要なポイントを箇条書きでまとめ、最後に一段落の要約を追加してください。
URL: ${url}`;

    const { text } = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        tools: [
          // 検索ツールと URL Context ツールの両方を使う
          { urlContext: {} },
          { googleSearch: {} },
        ],
      },
    });

    const summaryResult: SummaryResult = {
      id: `summary-${Date.now()}`,
      url,
      title: title,
      summary: text ?? "",
      createdAt: Date.now(),
    };

    return summaryResult;
  } catch (error) {
    alert((error as Error).message);
    console.error("Failed to generate summary:", error);
    return undefined;
  }
};

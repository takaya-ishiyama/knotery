import { createSignal, onMount } from "solid-js";

const GEMINI_API_KEY_STORAGE = "gemini-api-key";

const encryptApiKey = (key: string): string => {
  // 簡単な暗号化（本格的にはcrypto APIを使用）
  return btoa(key);
};

const decryptApiKey = (encryptedKey: string): string => {
  return atob(encryptedKey);
};

export const useGeminiApiKey = () => {
  const [apiKey, setApiKey] = createSignal("");
  const [status, setStatus] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  onMount(async () => {
    const result = await browser.storage.local.get(GEMINI_API_KEY_STORAGE);
    if (result[GEMINI_API_KEY_STORAGE]) {
      const decryptedKey = decryptApiKey(result[GEMINI_API_KEY_STORAGE]);
      setApiKey(decryptedKey);
      setStatus("APIキーが設定されています");
    }
  });

  // TODO: キーを暗号化して保存する
  const saveApiKey = async () => {
    const key = apiKey().trim();
    if (!key) {
      setStatus("APIキーを入力してください");
      return;
    }
    const encryptedKey = encryptApiKey(key);

    setIsLoading(true);
    try {
      await browser.storage.local.set({
        [GEMINI_API_KEY_STORAGE]: encryptedKey,
      });
      setStatus("APIキーを保存しました");
    } catch (error) {
      setStatus("保存中にエラーが発生しました");
      console.error("Failed to save API key:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    apiKey,
    setApiKey,
    status,
    isLoading,
    saveApiKey,
  };
};

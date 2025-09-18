import { summaryStorage } from "../utils/summaryStorage";

export default defineBackground(() => {
  console.log("Knotery background service started", { id: browser.runtime.id });

  // メッセージリスナーを設定
  browser.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      if (message.type === "SUMMARIZE_CURRENT_PAGE") {
        try {
          const { refetch } = message;

          // Gemini APIで要約を生成
          const instance = await geminiInitialize();
          const summary = await summarizeContent(instance)();

          if (summary) {
            // 要約を保存
            await summaryStorage.saveSummary(summary);
            sendResponse({ success: true, summary });
          } else {
            sendResponse({ success: false, error: "要約の生成に失敗しました" });
          }
        } catch (error) {
          console.error("Error in summarize handler:", error);
          sendResponse({ success: false, error: "エラーが発生しました" });
        }
      }

      return true; // 非同期レスポンスのため
    },
  );
});

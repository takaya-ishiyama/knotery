import { createResource } from "solid-js";
import type { SummaryResult } from "../../../utils/geminiApi";
import { summaryStorage } from "../../../utils/summaryStorage";

export const useSummaries = () => {
  const [summaries, { refetch }] = createResource<SummaryResult[]>(
    async () => {
      return await summaryStorage.getAllSummaries();
    },
  );

  const summarizeCurrentPage = async () => {
    try {
      // 現在のタブを取得
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab.id || !tab.url) return;

      // コンテンツスクリプトからページ内容を取得
      const response = await browser.tabs.sendMessage(tab.id, {
        type: "GET_PAGE_CONTENT",
      });

      if (response && response.content) {
        // バックグラウンドスクリプトに要約リクエストを送信
        const result = await browser.runtime.sendMessage({
          type: "SUMMARIZE_CURRENT_PAGE",
          data: {
            content: response.content,
            url: tab.url,
            title: tab.title || "無題",
          },
        });

        if (result.success) {
          await refetch();
          return { success: true, message: "要約を作成しました" };
        } else {
          return {
            success: false,
            message: result.error || "要約の作成に失敗しました",
          };
        }
      } else {
        return { success: false, message: "ページ内容を取得できませんでした" };
      }
    } catch (error) {
      console.error("Error in summarizeCurrentPage:", error);
      return { success: false, message: "エラーが発生しました" };
    }
  };

  const deleteSummary = async (id: string) => {
    await summaryStorage.deleteSummary(id);
    await refetch();
  };

  const clearAllSummaries = async () => {
    if (confirm("すべての要約を削除してもよろしいですか？")) {
      await summaryStorage.clearAllSummaries();
      await refetch();
    }
  };

  return {
    summaries,
    summarizeCurrentPage,
    deleteSummary,
    clearAllSummaries,
  };
};


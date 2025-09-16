import { createResource } from "solid-js";
import {
  geminiInitialize,
  summarizeContent,
  type SummaryResult,
} from "../../../utils/geminiApi";
import { summaryStorage } from "../../../utils/summaryStorage";

export const useSummaries = () => {
  const [summaries, { refetch }] = createResource<SummaryResult[]>(
    async () => {
      return await summaryStorage.getAllSummaries();
    },
  );

  const summarizeCurrentPage = async () => {
    alert("要約の作成を開始します。しばらくお待ちください。");
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
        // 直列でやってもユーザー体験変わらなそうなので
        // const result = await browser.runtime.sendMessage({
        //   type: "SUMMARIZE_CURRENT_PAGE",
        //   data: {
        //     content: response.content,
        //     url: tab.url,
        //     title: tab.title || "無題",
        //   },
        //   refetch,
        // });
        //
        // return result;

        const instance = await geminiInitialize();
        const summary = await summarizeContent(instance)({
          url: tab.url,
          title: tab.title ?? "",
        });

        if (summary) {
          await summaryStorage.saveSummary(summary);
          await refetch();
          return { success: true, message: "🎉要約の作成が完了しました🎉" };
        } else {
          return {
            success: false,
            message: "要約の作成に失敗しました",
          };
        }
      } else {
        return { success: false, message: "ページ内容を取得できませんでした" };
      }
    } catch (error) {
      console.error("Error in summarizeCurrentPage:", error);
      alert((error as Error).message);
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

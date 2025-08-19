import { showNotification } from "@/entrypoints/hooks/notification";
import { saveToStorage } from "@/entrypoints/hooks/saveToStorage";

type Props = {
  refetch: () => Promise<void>;
};
export const usePopupHandler = ({ refetch }: Props) => {
  const saveCurrentPage = async () => {
    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab.title && tab.url) {
        await saveToStorage({
          title: tab.title,
          url: tab.url,
        });
      }
      // 成功メッセージを表示
      showNotification("ページが保存されました！", "success");
      await refetch();
    } catch (error) {
      console.error("Failed to save current page:", error);
      showNotification("保存に失敗しました", "error");
    }
  };
  const deletePage = async (id: string) => {
    try {
      await PageStorage.deletePage(id);
      await refetch();
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };
  const clearAllPages = async () => {
    if (confirm("すべての保存ページを削除しますか？")) {
      try {
        await PageStorage.clearAllPages();
        await refetch();
      } catch (error) {
        console.error("Failed to clear all pages:", error);
      }
    }
  };
  const exportJSON = async () => {
    try {
      await PageStorage.downloadJSON();
    } catch (error) {
      console.error("Failed to export JSON:", error);
    }
  };

  return {
    saveCurrentPage,
    deletePage,
    clearAllPages,
    exportJSON,
  };
};

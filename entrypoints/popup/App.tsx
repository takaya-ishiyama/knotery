import { createEffect, createSignal, For } from "solid-js";
import { PageStorage, type SavedPage } from "../../utils/storage";
import "./App.css";
import { saveToStorage } from "../hooks/saveToStorage";
import { showNotification } from "../hooks/notification";

function App() {
  const [savedPages, setSavedPages] = createSignal<SavedPage[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [currentTab, setCurrentTab] = createSignal<"list" | "current">("list");

  createEffect(async () => {
    try {
      const pages = await PageStorage.getAllPages();
      setSavedPages(pages);
    } catch (error) {
      console.error("Failed to load saved pages:", error);
    } finally {
      setIsLoading(false);
    }
  });

  const saveCurrentPage = async () => {
    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab.title && tab.url) {
        const savedPage = await saveToStorage({
          title: tab.title,
          url: tab.url,
        });
        setSavedPages([...savedPages(), savedPage]);
      }
      // 成功メッセージを表示
      showNotification("ページが保存されました！", "success");
    } catch (error) {
      console.error("Failed to save current page:", error);
      showNotification("保存に失敗しました", "error");
    }
  };

  const deletePage = async (id: string) => {
    try {
      await PageStorage.deletePage(id);
      setSavedPages(savedPages().filter((page) => page.id !== id));
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  const exportJSON = async () => {
    try {
      await PageStorage.downloadJSON();
    } catch (error) {
      console.error("Failed to export JSON:", error);
    }
  };

  const clearAllPages = async () => {
    if (confirm("すべての保存ページを削除しますか？")) {
      try {
        await PageStorage.clearAllPages();
        setSavedPages([]);
      } catch (error) {
        console.error("Failed to clear all pages:", error);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("ja-JP");
  };

  return (
    <div style="width: 400px; padding: 16px;">
      <h1 style="margin: 0 0 16px 0; font-size: 20px;">📚 Knotery</h1>

      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <button
          onClick={() => setCurrentTab("list")}
          style={`
            padding: 8px 16px;
            border: 1px solid #ccc;
            background: ${currentTab() === "list" ? "#007acc" : "white"};
            color: ${currentTab() === "list" ? "white" : "black"};
            border-radius: 4px;
            cursor: pointer;
          `}
        >
          保存済み
        </button>
        <button
          onClick={() => setCurrentTab("current")}
          style={`
            padding: 8px 16px;
            border: 1px solid #ccc;
            background: ${currentTab() === "current" ? "#007acc" : "white"};
            color: ${currentTab() === "current" ? "white" : "black"};
            border-radius: 4px;
            cursor: pointer;
          `}
        >
          現在のページ
        </button>
      </div>

      {currentTab() === "list" && (
        <div>
          <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <button
              onClick={exportJSON}
              style="
                padding: 6px 12px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
              "
            >
              JSON出力
            </button>
            <button
              onClick={clearAllPages}
              style="
                padding: 6px 12px;
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
              "
            >
              すべて削除
            </button>
          </div>

          {isLoading()
            ? <div>読み込み中...</div>
            : savedPages().length === 0
            ? (
              <div style="text-align: center; color: #666; padding: 20px;">
                保存されたページがありません
              </div>
            )
            : (
              <div style="max-height: 300px; overflow-y: auto;">
                <For each={savedPages()}>
                  {(page) => (
                    <div style="
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 8px;
                    background: #f9f9f9;
                  ">
                      <div style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">
                        {page.title}
                      </div>
                      <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                        {page.url}
                      </div>
                      <div style="font-size: 11px; color: #888; margin-bottom: 8px;">
                        {formatDate(page.savedAt)}
                      </div>
                      <div style="display: flex; gap: 8px;">
                        <button
                          onClick={() => browser.tabs.create({ url: page.url })}
                          style="
                          padding: 4px 8px;
                          background: #007acc;
                          color: white;
                          border: none;
                          border-radius: 3px;
                          cursor: pointer;
                          font-size: 11px;
                        "
                        >
                          開く
                        </button>
                        <button
                          onClick={() => deletePage(page.id)}
                          style="
                          padding: 4px 8px;
                          background: #dc3545;
                          color: white;
                          border: none;
                          border-radius: 3px;
                          cursor: pointer;
                          font-size: 11px;
                        "
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            )}
        </div>
      )}

      {currentTab() === "current" && (
        <div>
          <div style="margin-bottom: 16px;">
            <button
              onClick={saveCurrentPage}
              style="
                width: 100%;
                padding: 12px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
              "
            >
              📌 現在のページを保存
            </button>
          </div>
          <div style="font-size: 12px; color: #666;">
            現在のページを保存するか、ページ上の「📌
            保存」ボタンを使用してください。
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

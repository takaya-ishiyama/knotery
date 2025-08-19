import { createSignal, For } from "solid-js";
import { type SavedPage } from "../../utils/storage";
import "./App.css";
import { getStorageData } from "./hooks/getStorageData";
import { usePopupHandler } from "./hooks/usePopupHandler";

function App() {
  const [data, { refetch }] = createResource<SavedPage[]>(getStorageData);
  const [currentTab, setCurrentTab] = createSignal<"list" | "current">("list");

  const { saveCurrentPage, deletePage, clearAllPages, exportJSON } =
    usePopupHandler({
      refetch: async () => {
        refetch();
      },
    });

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

          <Suspense fallback={<div>読み込み中...</div>}>
            <Show
              when={(data()?.length ?? 0) > 0}
              fallback={
                <div style="text-align: center; color: #666; padding: 20px;">
                  保存されたページがありません
                </div>
              }
            >
              <div style="max-height: 300px; overflow-y: auto;">
                <For each={data()}>
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
            </Show>
          </Suspense>
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

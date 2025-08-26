import { createResource, createSignal, For, Show, Suspense } from "solid-js";
import { type SavedPage } from "../../utils/storage";
import "./App.css";
import { getStorageData } from "./hooks/getStorageData";
import { usePopupHandler } from "./hooks/usePopupHandler";
import { useGeminiApiKey } from "./hooks/useGeminiApiKey";
import { useSummaries } from "./hooks/useSummaries";

function App() {
  const [data, { refetch }] = createResource<SavedPage[]>(getStorageData);
  const [currentTab, setCurrentTab] = createSignal<
    "list" | "current" | "summaries" | "settings"
  >("list");

  const { saveCurrentPage, deletePage, clearAllPages, exportJSON } =
    usePopupHandler({
      refetch: async () => {
        refetch();
      },
    });

  const { apiKey, setApiKey, status, isLoading, saveApiKey } =
    useGeminiApiKey();
  // const { summaries, summarizeCurrentPage, deleteSummary, clearAllSummaries } =
  useSummaries();

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
        <button
          onClick={() => setCurrentTab("summaries")}
          style={`
            padding: 8px 16px;
            border: 1px solid #ccc;
            background: ${currentTab() === "summaries" ? "#007acc" : "white"};
            color: ${currentTab() === "summaries" ? "white" : "black"};
            border-radius: 4px;
            cursor: pointer;
          `}
        >
          要約
        </button>
        <button
          onClick={() => setCurrentTab("settings")}
          style={`
            padding: 8px 16px;
            border: 1px solid #ccc;
            background: ${currentTab() === "settings" ? "#007acc" : "white"};
            color: ${currentTab() === "settings" ? "white" : "black"};
            border-radius: 4px;
            cursor: pointer;
          `}
        >
          設定
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

      {
        /**
        {currentTab() === "summaries" && (
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0; font-size: 16px;">ページ要約</h2>
            <button
              onClick={async () => {
                const result = await summarizeCurrentPage();
                if (result) {
                  alert(result.message);
                }
              }}
              style="
                padding: 6px 12px;
                background: #17a2b8;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
              "
            >
              現在のページを要約
            </button>
          </div>

          <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <button
              onClick={clearAllSummaries}
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
              when={(summaries()?.length ?? 0) > 0}
              fallback={
                <div style="text-align: center; color: #666; padding: 20px;">
                  要約がありません
                </div>
              }
            >
              <div style="max-height: 300px; overflow-y: auto;">
                <For each={summaries()}>
                  {(summary) => (
                    <div style="
                      border: 1px solid #eee;
                      border-radius: 8px;
                      padding: 12px;
                      margin-bottom: 8px;
                      background: #f9f9f9;
                    ">
                      <div style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">
                        {summary.title}
                      </div>
                      <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                        {summary.url}
                      </div>
                      <div style="font-size: 12px; line-height: 1.5; margin-bottom: 8px; white-space: pre-wrap;">
                        {summary.summary}
                      </div>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 11px; color: #888;">
                          {formatDate(summary.createdAt)}
                        </div>
                        <button
                          onClick={() => deleteSummary(summary.id)}
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
      */
      }

      {currentTab() === "settings" && (
        <div>
          <h2 style="margin: 0 0 16px 0; font-size: 16px;">API設定</h2>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: bold;">
              Gemini API キー
            </label>
            <input
              type="password"
              value={apiKey()}
              onInput={(e) => setApiKey(e.currentTarget.value)}
              style="
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 14px;
              "
              placeholder="AIzaSy..."
            />
            <div style="font-size: 11px; color: #dc3545; margin-top: 4px;">
              ⚠️ APIキーはローカルに保存されます。共用PCでは注意してください
            </div>
          </div>
          <button
            onClick={saveApiKey}
            disabled={isLoading()}
            style="
              padding: 8px 16px;
              background: #007acc;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              opacity: ${isLoading() ? 0.6 : 1};
            "
          >
            {isLoading() ? "保存中..." : "保存"}
          </button>
          <div
            style={`margin-top: 12px; font-size: 12px; color: ${
              status().includes("エラー") ? "#dc3545" : "#28a745"
            };`}
          >
            {status()}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import { Show, createResource, createSignal } from "solid-js";
import type { SavedPage } from "../../utils/storage";
import "./App.css";
import { SavedPagesList } from "./components/SavedPagesList";
import { SettingsTab } from "./components/SettingsTab";
import { SummariesTab } from "./components/SummariesTab";
import { TabButton } from "./components/TabButton";
import { getStorageData } from "./hooks/getStorageData";
import { useGeminiApiKey } from "./hooks/useGeminiApiKey";
import { usePopupHandler } from "./hooks/usePopupHandler";
import { useSummaries } from "./hooks/useSummaries";

function App() {
	const [data, { refetch }] = createResource<SavedPage[]>(getStorageData);
	const [currentTab, setCurrentTab] = createSignal<
		"list" | "summaries" | "settings"
	>("list");

	const { saveCurrentPage, deletePage, clearAllPages, exportJSON } =
		usePopupHandler({
			refetch: async () => {
				await refetch();
			},
		});

	const { apiKey, setApiKey, status, isLoading, saveApiKey } =
		useGeminiApiKey();
	const { summaries, summarizeCurrentPage, deleteSummary, clearAllSummaries } =
		useSummaries();

	return (
		<div style={{ width: "400px", padding: "16px" }}>
			<h1 style={{ margin: "0 0 16px 0", "font-size": "20px" }}>📚 Knotery</h1>

			<div style={{ display: "flex", gap: "8px", "margin-bottom": "16px" }}>
				<TabButton
					active={currentTab() === "list"}
					onClick={() => setCurrentTab("list")}
				>
					保存ページ
				</TabButton>
				<TabButton
					active={currentTab() === "summaries"}
					onClick={() => setCurrentTab("summaries")}
				>
					要約
				</TabButton>
				<TabButton
					active={currentTab() === "settings"}
					onClick={() => setCurrentTab("settings")}
				>
					設定
				</TabButton>
			</div>

			<Show when={currentTab() === "list"}>
				<SavedPagesList
					data={data()}
					onDelete={deletePage}
					onClearAll={clearAllPages}
					onExport={exportJSON}
					onSaveCurrentPage={saveCurrentPage}
				/>
			</Show>

			<Show when={currentTab() === "summaries"}>
				<SummariesTab
					summaries={summaries()}
					onSummarizeCurrent={summarizeCurrentPage}
					onDelete={deleteSummary}
					onClearAll={clearAllSummaries}
				/>
			</Show>

			<Show when={currentTab() === "settings"}>
				<SettingsTab
					apiKey={apiKey}
					setApiKey={setApiKey}
					status={status}
					isLoading={isLoading}
					onSaveApiKey={saveApiKey}
				/>
			</Show>
		</div>
	);
}

export default App;

import { For, Show, Suspense } from "solid-js";
import type { SavedPage } from "../../../utils/storage";

interface SavedPagesListProps {
	data: SavedPage[] | undefined;
	onDelete: (id: string) => void;
	onClearAll: () => void;
	onExport: () => void;
	onSaveCurrentPage: () => void;
}

export function SavedPagesList(props: SavedPagesListProps) {
	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleString("ja-JP");
	};

	return (
		<div>
			<div style={{ display: "flex", gap: "8px", "margin-bottom": "16px" }}>
				<button
					type="button"
					onClick={props.onSaveCurrentPage}
					style={{
						padding: "6px 12px",
						background: "#007acc",
						color: "white",
						border: "none",
						"border-radius": "4px",
						cursor: "pointer",
						"font-size": "12px",
					}}
				>
					📌 現在のページを保存
				</button>
				<button
					type="button"
					onClick={props.onExport}
					style={{
						padding: "6px 12px",
						background: "#28a745",
						color: "white",
						border: "none",
						"border-radius": "4px",
						cursor: "pointer",
						"font-size": "12px",
					}}
				>
					JSON出力
				</button>
				<button
					type="button"
					onClick={props.onClearAll}
					style={{
						padding: "6px 12px",
						background: "#dc3545",
						color: "white",
						border: "none",
						"border-radius": "4px",
						cursor: "pointer",
						"font-size": "12px",
					}}
				>
					すべて削除
				</button>
			</div>

			<Suspense fallback={<div>読み込み中...</div>}>
				<Show
					when={(props.data?.length ?? 0) > 0}
					fallback={
						<div
							style={{
								"text-align": "center",
								color: "#666",
								padding: "20px",
							}}
						>
							保存されたページがありません
						</div>
					}
				>
					<div style={{ "max-height": "300px", "overflow-y": "auto" }}>
						<For each={props.data}>
							{(page) => (
								<div
									style={{
										border: "1px solid #eee",
										"border-radius": "8px",
										padding: "12px",
										"margin-bottom": "8px",
										background: "#f9f9f9",
									}}
								>
									<div
										style={{
											"font-weight": "bold",
											"margin-bottom": "4px",
											"font-size": "14px",
										}}
									>
										{page.title}
									</div>
									<div
										style={{
											"font-size": "12px",
											color: "#666",
											"margin-bottom": "4px",
										}}
									>
										{page.url}
									</div>
									<div
										style={{
											"font-size": "11px",
											color: "#888",
											"margin-bottom": "8px",
										}}
									>
										{formatDate(page.savedAt)}
									</div>
									<div style={{ display: "flex", gap: "8px" }}>
										<button
											type="button"
											onClick={() => browser.tabs.create({ url: page.url })}
											style={{
												padding: "4px 8px",
												background: "#007acc",
												color: "white",
												border: "none",
												"border-radius": "3px",
												cursor: "pointer",
												"font-size": "11px",
											}}
										>
											開く
										</button>
										<button
											type="button"
											onClick={() => props.onDelete(page.id)}
											style={{
												padding: "4px 8px",
												background: "#dc3545",
												color: "white",
												border: "none",
												"border-radius": "3px",
												cursor: "pointer",
												"font-size": "11px",
											}}
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
	);
}
import { For, Show, Suspense } from "solid-js";
import type { Summary } from "../hooks/useSummaries";

interface SummariesTabProps {
	summaries: Summary[] | undefined;
	onSummarizeCurrent: () => Promise<{ success: boolean; message: string } | undefined>;
	onDelete: (id: string) => void;
	onClearAll: () => void;
}

export function SummariesTab(props: SummariesTabProps) {
	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleString("ja-JP");
	};

	return (
		<div>
			<div
				style={{
					display: "flex",
					"justify-content": "space-between",
					"align-items": "center",
					"margin-bottom": "16px",
				}}
			>
				<h2 style={{ margin: "0", "font-size": "16px" }}>ページ要約</h2>
				<button
					type="button"
					onClick={async () => {
						const result = await props.onSummarizeCurrent();
						if (result) {
							alert(result.message);
						}
					}}
					style={{
						padding: "6px 12px",
						background: "#17a2b8",
						color: "white",
						border: "none",
						"border-radius": "4px",
						cursor: "pointer",
						"font-size": "12px",
					}}
				>
					現在のページを要約
				</button>
			</div>

			<div style={{ display: "flex", gap: "8px", "margin-bottom": "16px" }}>
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
					when={(props.summaries?.length ?? 0) > 0}
					fallback={
						<div
							style={{
								"text-align": "center",
								color: "#666",
								padding: "20px",
							}}
						>
							要約がありません
						</div>
					}
				>
					<div style={{ "max-height": "300px", "overflow-y": "auto" }}>
						<For each={props.summaries}>
							{(summary) => (
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
										{summary.title}
									</div>
									<div
										style={{
											"font-size": "12px",
											color: "#666",
											"margin-bottom": "8px",
										}}
									>
										{summary.url}
									</div>
									<div
										style={{
											"font-size": "12px",
											"line-height": "1.5",
											"margin-bottom": "8px",
											"white-space": "pre-wrap",
										}}
									>
										{summary.summary}
									</div>
									<div
										style={{
											display: "flex",
											"justify-content": "space-between",
											"align-items": "center",
										}}
									>
										<div style={{ "font-size": "11px", color: "#888" }}>
											{formatDate(summary.createdAt)}
										</div>
										<button
											type="button"
											onClick={() => props.onDelete(summary.id)}
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
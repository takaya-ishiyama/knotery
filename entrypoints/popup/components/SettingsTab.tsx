interface SettingsTabProps {
	apiKey: () => string;
	setApiKey: (key: string) => void;
	status: () => string;
	isLoading: () => boolean;
	onSaveApiKey: () => void;
}

export function SettingsTab(props: SettingsTabProps) {
	return (
		<div>
			<h2 style={{ margin: "0 0 16px 0", "font-size": "16px" }}>API設定</h2>
			<div style={{ "margin-bottom": "16px" }}>
				<label
					for="gemini-api-key"
					style={{
						display: "block",
						"margin-bottom": "8px",
						"font-size": "14px",
						"font-weight": "bold",
					}}
				>
					Gemini API キー
				</label>
				<input
					id="gemini-api-key"
					type="password"
					value={props.apiKey()}
					onInput={(e) => props.setApiKey(e.currentTarget.value)}
					style={{
						width: "100%",
						padding: "8px",
						border: "1px solid #ccc",
						"border-radius": "4px",
						"font-size": "14px",
					}}
					placeholder="AIzaSy..."
				/>
				<div
					style={{
						"font-size": "11px",
						color: "#dc3545",
						"margin-top": "4px",
					}}
				>
					⚠️ APIキーはローカルに保存されます。共用PCでは注意してください
				</div>
			</div>
			<button
				type="button"
				onClick={props.onSaveApiKey}
				disabled={props.isLoading()}
				style={{
					padding: "8px 16px",
					background: "#007acc",
					color: "white",
					border: "none",
					"border-radius": "4px",
					cursor: "pointer",
					"font-size": "14px",
					opacity: props.isLoading() ? "0.6" : "1",
				}}
			>
				{props.isLoading() ? "保存中..." : "保存"}
			</button>
			<div
				style={{
					"margin-top": "12px",
					"font-size": "12px",
					color: props.status().includes("エラー") ? "#dc3545" : "#28a745",
				}}
			>
				{props.status()}
			</div>
		</div>
	);
}
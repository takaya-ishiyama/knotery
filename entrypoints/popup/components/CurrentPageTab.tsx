interface CurrentPageTabProps {
	onSaveCurrentPage: () => void;
}

export function CurrentPageTab(props: CurrentPageTabProps) {
	return (
		<div>
			<div style={{ "margin-bottom": "16px" }}>
				<button
					type="button"
					onClick={props.onSaveCurrentPage}
					style={{
						width: "100%",
						padding: "12px",
						background: "#28a745",
						color: "white",
						border: "none",
						"border-radius": "4px",
						cursor: "pointer",
						"font-size": "14px",
					}}
				>
					📌 現在のページを保存
				</button>
			</div>
			<div style={{ "font-size": "12px", color: "#666" }}>
				現在のページを保存するか、ページ上の「📌 保存」ボタンを使用してください。
			</div>
		</div>
	);
}
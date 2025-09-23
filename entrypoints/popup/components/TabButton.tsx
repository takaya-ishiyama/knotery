import type { JSX } from "solid-js";

type TabButtonProps = {
	active: boolean;
	onClick: () => void;
	children: JSX.Element;
};

export const TabButton = (props: TabButtonProps) => {
	return (
		<button
			type="button"
			onClick={props.onClick}
			style={{
				padding: "8px 16px",
				border: "1px solid #ccc",
				background: props.active ? "#007acc" : "white",
				color: props.active ? "white" : "black",
				"border-radius": "4px",
				cursor: "pointer",
			}}
		>
			{props.children}
		</button>
	);
};

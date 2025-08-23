import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-solid"],
	manifest: {
		icons: {
			16: "icon/icon16.png",
			48: "icon/icon48.png",
			128: "icon/icon128.png",
		},
		permissions: [
			"storage",
			"tabs",
			"activeTab"
		],
	},
});

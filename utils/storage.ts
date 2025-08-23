export interface SavedPage {
	id: string;
	title: string;
	url: string;
	savedAt: number;
}

export const PageStorage = {
	STORAGE_KEY: "savedPages" as const,

	async saveCurrentPage(title: string, url: string): Promise<SavedPage> {
		const page: SavedPage = {
			id: crypto.randomUUID(),
			title,
			url,
			savedAt: Date.now(),
		};

		const existingPages = await this.getAllPages();
		const updatedPages = [...existingPages, page];

		await browser.storage.sync.set({
			[this.STORAGE_KEY]: updatedPages,
		});

		return page;
	},

	async getAllPages(): Promise<SavedPage[]> {
		try {
			const result = await browser.storage.sync.get(this.STORAGE_KEY);
			return result[this.STORAGE_KEY] || [];
		} catch (error) {
			console.error("Failed to get saved pages:", error);
			return [];
		}
	},

	async deletePage(id: string): Promise<void> {
		const existingPages = await this.getAllPages();
		const filteredPages = existingPages.filter((page) => page.id !== id);

		await browser.storage.sync.set({
			[this.STORAGE_KEY]: filteredPages,
		});
	},

	async clearAllPages(): Promise<void> {
		await browser.storage.sync.remove(this.STORAGE_KEY);
	},

	async exportToJSON(): Promise<string> {
		const pages = await this.getAllPages();
		return JSON.stringify(pages, null, 2);
	},

	async downloadJSON(): Promise<void> {
		const jsonData = await this.exportToJSON();
		const blob = new Blob([jsonData], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = `saved-pages-${new Date().toISOString().split("T")[0]}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	},
};

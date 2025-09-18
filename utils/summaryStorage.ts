import type { SummaryResult } from "./geminiApi";

const SUMMARIES_STORAGE_KEY = "summaries";

export const summaryStorage = {
  async getAllSummaries(): Promise<SummaryResult[]> {
    const result = await browser.storage.local.get(SUMMARIES_STORAGE_KEY);
    return result[SUMMARIES_STORAGE_KEY] || [];
  },

  async saveSummary(summary: SummaryResult): Promise<void> {
    const summaries = await this.getAllSummaries();
    summaries.unshift(summary); // 新しい要約を先頭に追加
    await browser.storage.local.set({ [SUMMARIES_STORAGE_KEY]: summaries });
  },

  async deleteSummary(id: string): Promise<void> {
    const summaries = await this.getAllSummaries();
    const filtered = summaries.filter((s) => s.id !== id);
    await browser.storage.local.set({ [SUMMARIES_STORAGE_KEY]: filtered });
  },

  async clearAllSummaries(): Promise<void> {
    await browser.storage.local.remove(SUMMARIES_STORAGE_KEY);
  },
};
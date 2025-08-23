export const getStorageData = async () => {
  try {
    const pages = await PageStorage.getAllPages();
    return pages;
  } catch (error) {
    console.error("Failed to load saved pages:", error);
    throw new Error("Failed to load saved pages");
  }
};

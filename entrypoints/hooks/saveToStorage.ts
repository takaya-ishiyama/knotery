type Props = {
  title: string;
  url: string;
};
export const saveToStorage = async ({ title, url }: Props) => {
  try {
    const savedData = await PageStorage.saveCurrentPage(
      title,
      url,
    );

    return savedData;
  } catch (error) {
    console.error("Failed to save page:", error);
    throw error; // エラーを再スローして呼び出し元で処理できるようにする
  }
};

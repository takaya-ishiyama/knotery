export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("Content script loaded for:", window.location.href);
    //
    // メッセージリスナーを設定
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "getCurrentPageInfo") {
        const pageInfo = {
          title: document.title,
          url: window.location.href,
        };
        sendResponse(pageInfo);
      }
      
      if (message.type === "GET_PAGE_CONTENT") {
        // ページのメインコンテンツを取得
        const content = document.body?.innerText || "";
        sendResponse({ content });
      }
    });
  },
});

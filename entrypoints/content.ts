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
    });
  },
});

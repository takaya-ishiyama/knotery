// import { PageStorage } from "../utils/storage";
// import { showNotification } from "./hooks/notification";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("Content script loaded for:", window.location.href);

    // // ページ保存用のボタンを追加
    // createSaveButton();
    //
    // // 保存ページ一覧パネルを追加
    // createSavedPagesPanel();
    //
    // メッセージリスナーを設定
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "getCurrentPageInfo") {
        const pageInfo = {
          title: document.title,
          url: window.location.href,
        };
        sendResponse(pageInfo);
      } else if (message.action === "saveCurrentPage") {
        // handleSaveCurrentPage();
      }
    });
  },
});

// function createSaveButton() {
//   // 既存のボタンがあれば削除
//   const existingButton = document.getElementById("knotery-save-button");
//   if (existingButton) {
//     existingButton.remove();
//   }
//
//   // 保存ボタンを作成
//   const saveButton = document.createElement("button");
//   saveButton.id = "knotery-save-button";
//   saveButton.textContent = "📌 保存";
//   saveButton.style.cssText = `
//     position: fixed;
//     top: 20px;
//     right: 20px;
//     z-index: 10000;
//     background: #4CAF50;
//     color: white;
//     border: none;
//     padding: 10px 15px;
//     border-radius: 5px;
//     cursor: pointer;
//     font-size: 14px;
//     box-shadow: 0 2px 5px rgba(0,0,0,0.2);
//   `;
//
//   saveButton.addEventListener("click", handleSaveCurrentPage);
//   document.body.appendChild(saveButton);
// }

// async function handleSaveCurrentPage() {
//   try {
//     const savedPage = await PageStorage.saveCurrentPage(
//       document.title,
//       window.location.href,
//     );
//
//     // 成功メッセージを表示
//     showNotification("ページが保存されました！", "success");
//
//     console.log("Page saved:", savedPage);
//   } catch (error) {
//     console.error("Failed to save page:", error);
//     showNotification("保存に失敗しました", "error");
//   }
// }

// function createSavedPagesPanel() {
//   // 既存のパネルがあれば削除
//   const existingPanel = document.getElementById("knotery-panel");
//   if (existingPanel) {
//     existingPanel.remove();
//   }
//
//   // パネル切り替えボタンを作成
//   const toggleButton = document.createElement("button");
//   toggleButton.id = "knotery-toggle-button";
//   toggleButton.textContent = "📚";
//   toggleButton.style.cssText = `
//     position: fixed;
//     top: 70px;
//     right: 20px;
//     z-index: 10000;
//     background: #007acc;
//     color: white;
//     border: none;
//     padding: 10px;
//     border-radius: 50%;
//     cursor: pointer;
//     font-size: 16px;
//     box-shadow: 0 2px 5px rgba(0,0,0,0.2);
//     width: 40px;
//     height: 40px;
//   `;
//
//   // パネルを作成
//   const panel = document.createElement("div");
//   panel.id = "knotery-panel";
//   panel.style.cssText = `
//     position: fixed;
//     top: 120px;
//     right: 20px;
//     width: 350px;
//     max-height: 400px;
//     background: white;
//     border: 1px solid #ccc;
//     border-radius: 8px;
//     box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//     z-index: 10000;
//     display: none;
//     overflow: hidden;
//   `;
//
//   // パネルヘッダー
//   const header = document.createElement("div");
//   header.style.cssText = `
//     background: #f5f5f5;
//     padding: 12px;
//     border-bottom: 1px solid #eee;
//     font-weight: bold;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//   `;
//   header.innerHTML = `
//     <span>📚 保存されたページ</span>
//     <div>
//       <button id="knotery-export-json" style="
//         background: #28a745;
//         color: white;
//         border: none;
//         padding: 4px 8px;
//         border-radius: 3px;
//         cursor: pointer;
//         font-size: 11px;
//         margin-right: 8px;
//       ">JSON出力</button>
//       <button id="knotery-close-panel" style="
//         background: #dc3545;
//         color: white;
//         border: none;
//         padding: 4px 8px;
//         border-radius: 3px;
//         cursor: pointer;
//         font-size: 11px;
//       ">×</button>
//     </div>
//   `;
//
//   // パネル内容
//   const content = document.createElement("div");
//   content.id = "knotery-panel-content";
//   content.style.cssText = `
//     max-height: 320px;
//     overflow-y: auto;
//     padding: 12px;
//   `;
//
//   panel.appendChild(header);
//   panel.appendChild(content);
//
//   // イベントリスナーを設定
//   let isOpen = false;
//   toggleButton.addEventListener("click", () => {
//     isOpen = !isOpen;
//     panel.style.display = isOpen ? "block" : "none";
//     if (isOpen) {
//       loadSavedPages();
//     }
//   });
//
//   header.querySelector("#knotery-close-panel")?.addEventListener(
//     "click",
//     () => {
//       isOpen = false;
//       panel.style.display = "none";
//     },
//   );
//
//   header.querySelector("#knotery-export-json")?.addEventListener(
//     "click",
//     async () => {
//       try {
//         await PageStorage.downloadJSON();
//         showNotification("JSONファイルをダウンロードしました", "success");
//       } catch (error) {
//         console.error("Failed to export JSON:", error);
//         showNotification("JSON出力に失敗しました", "error");
//       }
//     },
//   );
//
//   document.body.appendChild(toggleButton);
//   document.body.appendChild(panel);
// }

// async function loadSavedPages() {
//   const content = document.getElementById("knotery-panel-content");
//   if (!content) return;
//
//   try {
//     content.innerHTML =
//       '<div style="text-align: center; color: #666;">読み込み中...</div>';
//
//     const pages = await PageStorage.getAllPages();
//
//     if (pages.length === 0) {
//       content.innerHTML =
//         '<div style="text-align: center; color: #666;">保存されたページがありません</div>';
//       return;
//     }
//
//     content.innerHTML = "";
//
//     pages.reverse().forEach((page) => {
//       const pageElement = document.createElement("div");
//       pageElement.style.cssText = `
//         border: 1px solid #eee;
//         border-radius: 6px;
//         padding: 10px;
//         margin-bottom: 8px;
//         background: #f9f9f9;
//       `;
//
//       const title = document.createElement("div");
//       title.textContent = page.title;
//       title.style.cssText = `
//         font-weight: bold;
//         margin-bottom: 4px;
//         font-size: 13px;
//         cursor: pointer;
//         color: #007acc;
//       `;
//       title.addEventListener("click", () => {
//         window.open(page.url, "_blank");
//       });
//
//       const url = document.createElement("div");
//       url.textContent = page.url;
//       url.style.cssText = `
//         font-size: 11px;
//         color: #666;
//         margin-bottom: 4px;
//         word-break: break-all;
//       `;
//
//       const date = document.createElement("div");
//       date.textContent = new Date(page.savedAt).toLocaleString("ja-JP");
//       date.style.cssText = `
//         font-size: 10px;
//         color: #888;
//         margin-bottom: 6px;
//       `;
//
//       const actions = document.createElement("div");
//       actions.style.cssText = "display: flex; gap: 6px;";
//
//       const openButton = document.createElement("button");
//       openButton.textContent = "開く";
//       openButton.style.cssText = `
//         background: #007acc;
//         color: white;
//         border: none;
//         padding: 3px 6px;
//         border-radius: 3px;
//         cursor: pointer;
//         font-size: 10px;
//       `;
//       openButton.addEventListener("click", () => {
//         window.open(page.url, "_blank");
//       });
//
//       const deleteButton = document.createElement("button");
//       deleteButton.textContent = "削除";
//       deleteButton.style.cssText = `
//         background: #dc3545;
//         color: white;
//         border: none;
//         padding: 3px 6px;
//         border-radius: 3px;
//         cursor: pointer;
//         font-size: 10px;
//       `;
//       deleteButton.addEventListener("click", async () => {
//         if (confirm("このページを削除しますか？")) {
//           try {
//             await PageStorage.deletePage(page.id);
//             loadSavedPages();
//             showNotification("ページを削除しました", "success");
//           } catch (error) {
//             console.error("Failed to delete page:", error);
//             showNotification("削除に失敗しました", "error");
//           }
//         }
//       });
//
//       actions.appendChild(openButton);
//       actions.appendChild(deleteButton);
//
//       pageElement.appendChild(title);
//       pageElement.appendChild(url);
//       pageElement.appendChild(date);
//       pageElement.appendChild(actions);
//
//       content.appendChild(pageElement);
//     });
//   } catch (error) {
//     console.error("Failed to load saved pages:", error);
//     content.innerHTML =
//       '<div style="text-align: center; color: #f44336;">読み込みに失敗しました</div>';
//   }
// }

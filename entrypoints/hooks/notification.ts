export const showNotification = (
  message: string,
  type: "success" | "error",
) => {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 10001;
    background: ${type === "success" ? "#4CAF50" : "#f44336"};
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;

  document.body.appendChild(notification);

  // 3秒後に自動削除
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
};

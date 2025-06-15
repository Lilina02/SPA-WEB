import "./styles/main.css";
import "./components/skipToContent.js";
import "./components/navbar.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import router from "./routers/routers.js";

let currentDestroy = null;

async function handleRouteChange() {
  if (typeof currentDestroy === "function") {
    currentDestroy();
  }
  currentDestroy = await router();
}

window.addEventListener("DOMContentLoaded", handleRouteChange);
window.addEventListener("hashchange", handleRouteChange);

if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "./service-worker.js"
      );
      console.log("Service Worker registered:", registration);

      if ("Notification" in window && Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          registration.showNotification("Terima kasih!", {
            body: "Kamu akan menerima notifikasi cerita baru.",
            icon: "./icons/download.jpg",
          });
        }
      }
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (installBtn) {
    installBtn.hidden = false;
    installBtn.addEventListener("click", async () => {
      installBtn.hidden = true;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("User choice:", outcome);
      deferredPrompt = null;
    });
  }
});

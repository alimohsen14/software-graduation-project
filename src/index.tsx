import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import "./i18n";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CartProvider } from "./context/CartContext";
import { isWebView } from "./utils/platform";


// ✅ load model-viewer once
if (!customElements.get("model-viewer")) {
  import("@google/model-viewer");
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);

// Register Service Worker for FCM (Skip in WebView)

if (!isWebView() && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("✅ FCM Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("❌ FCM Service Worker registration failed:", error);
    });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import { initializeApp } from "firebase/app";
import { getMessaging, getToken as firebaseGetToken, isSupported } from "firebase/messaging";
import { getDatabase } from "firebase/database";
import { isWebView } from "./utils/platform";

const firebaseConfig = {
    apiKey: "AIzaSyC7cmo14o88QUrhX-1A9JJ4daeyzmZINjE", // ✔ X كبيرة
    authDomain: "palestine3d-3ba18.firebaseapp.com",
    projectId: "palestine3d-3ba18",
    storageBucket: "palestine3d-3ba18.firebasestorage.app",
    messagingSenderId: "962047427867",
    appId: "1:962047427867:web:5eed368fad82163b4abfbe",
};

const isWebViewEnv = isWebView();

// 1. Initialize Firebase App (Always, even in WebView, for Auth/DB)
let appInstance: any = null;
try {
    appInstance = initializeApp(firebaseConfig);
} catch (e) {
    console.error("Firebase Initialization failed", e);
}

// 2. Initialize Realtime Database (Always)
export const database = appInstance ? getDatabase(appInstance) : null;
export const app = appInstance;

/**
 * 3. Selective Messaging Initialization
 * Only runs in standard browsers. Skip in WebView or unsupported environments.
 */
export const initMessaging = async () => {
    if (isWebViewEnv) {
        console.log("🚫 FCM: Skipping messaging init (WebView detected).");
        return null;
    }

    try {
        const supported = await isSupported();
        if (!supported) {
            console.warn("🚫 FCM: Messaging not supported in this browser.");
            return null;
        }
        return getMessaging(appInstance);
    } catch (e) {
        console.warn("⚠️ FCM: Initialization failed", e);
        return null;
    }
};

// Re-export original functions for convenience if needed, 
// though initMessaging is now preferred for safety.
export const getToken = firebaseGetToken;
export { isSupported };

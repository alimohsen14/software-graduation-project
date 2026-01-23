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

// Conditionally Initialize Firebase
// If inside WebView, we DO NOT initialize anything to prevent runtime errors or native conflicts.

const isWebViewEnv = isWebView();

let appInstance: any = null;
let messagingInstance: any = null;
let databaseInstance: any = null;
let getTokenInstance: any = null;

if (!isWebViewEnv) {
    try {
        appInstance = initializeApp(firebaseConfig);
        databaseInstance = getDatabase(appInstance);
        // Messaging might still fail in some browsers (e.g. Brave), so we wrap it
        try {
            messagingInstance = getMessaging(appInstance);
            getTokenInstance = firebaseGetToken;
        } catch (e) {
            console.warn("Firebase Messaging failed to initialize", e);
        }
    } catch (e) {
        console.error("Firebase Initialization failed", e);
    }
} else {
    console.log("🚫 WebView detected: Firebase completely disabled.");
}

export const app = appInstance;
export const messaging = messagingInstance;
export const database = databaseInstance;
export const getToken = getTokenInstance;

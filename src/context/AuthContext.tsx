import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import { User, getMe, logout as authLogout, updatePushToken } from "../services/authService";
import { onMessage } from "firebase/messaging";
import { messaging, getToken } from "../firebase";
import { toast } from "react-toastify";

interface AuthContextType {
    user: User | null | undefined;
    refreshUser: () => Promise<User | null>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: undefined,
    refreshUser: async () => null,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // undefined = loading/checking
    // null = unauthenticated
    // User = authenticated
    const [user, setUser] = useState<User | null | undefined>(undefined);

    const refreshUser = useCallback(async (): Promise<User | null> => {
        try {
            console.log("🔄 refreshUser: Calling /auth/me");
            const res = await getMe();

            // Log raw data to debug structure
            console.log("🔍 /auth/me Response Data:", res.data);

            // Handle both { user: ... } envelope and direct User object
            const data: any = res.data;
            const newUser = data?.user || (data?.id ? data : null);

            // ===================================
            // ADMIN AS SELLER NORMALIZATION
            // ===================================
            if (newUser) {
                // Ensure role flags are derived as per rules:
                // isAdmin = response.isAdmin === true
                // isSeller = response.store?.type === "SELLER"
                newUser.isAdmin = newUser.isAdmin === true;
                newUser.isSeller = newUser.store?.type === "SELLER";
            }

            console.log("✅ refreshUser: Set User", newUser);
            setUser(newUser);
            return newUser;
        } catch (error) {
            console.error("❌ refreshUser: Failed", error);
            setUser(null);
            return null;
        }
    }, []);

    // ONE call on mount
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    // Handle Push Notifications & Token Registration (Web + Mobile Bridge)
    useEffect(() => {
        // Only proceed if authenticated and NOT an admin
        if (!user || user.isAdmin) return;

        let unsubscribeForeground: () => void;

        // ----------------------------------------------------
        // 1. MOBILE WEBVIEW BRIDGE
        // ----------------------------------------------------
        const checkMobileToken = async () => {
            // @ts-ignore
            const mobileToken = window.FCM_DEVICE_TOKEN;
            if (mobileToken) {
                console.log("📲 Mobile FCM token detected:", mobileToken);
                const storageKey = `mobile_fcm_sent_${user.id}`;
                const lastSentToken = localStorage.getItem(storageKey);

                if (lastSentToken !== mobileToken) {
                    try {
                        await updatePushToken(mobileToken, "android");
                        localStorage.setItem(storageKey, mobileToken);
                        console.log("✅ Mobile FCM token registered with backend");
                    } catch (e) {
                        console.warn("⚠️ Failed to register mobile token", e);
                    }
                } else {
                    console.log("ℹ️ Mobile FCM Token already registered");
                }
            }
        };

        // Check immediately (in case injected before mount)
        checkMobileToken();

        // Listen for event (in case injected after mount/reload)
        const handleMobileEvent = () => checkMobileToken();
        window.addEventListener("FCM_TOKEN_READY", handleMobileEvent);


        // ----------------------------------------------------
        // 2. WEB PUSH (BROWSER)
        // ----------------------------------------------------
        const initWebPush = async () => {
            try {
                // If we are in mobile WebView (token detected), we might skip web push registration
                // to avoid double-registration or permission prompts that don't make sense in WebView.
                // However, request below is safe.

                // Feature Support Check
                if (!("serviceWorker" in navigator) || !("Notification" in window)) {
                    return;
                }

                // Request Permission
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') return;

                // Get Web Token
                // @ts-ignore
                const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY || import.meta.env?.VITE_FIREBASE_VAPID_KEY;
                if (!vapidKey) return;

                // Guard: If messaging/getToken is null (e.g. WebView), skip.
                if (!messaging || !getToken) {
                    console.log("🚫 Messaging/Token not active (WebView or unsupported), skipping Web Push.");
                    return;
                }

                const token = await getToken(messaging, { vapidKey });
                if (token) {
                    // Send to Backend (Dedup using session storage)
                    const storageKey = `fcm_sent_${user.id}`;
                    const lastSentToken = sessionStorage.getItem(storageKey);

                    if (lastSentToken !== token) {
                        try {
                            console.log("🚀 Sending WEB FCM token...");
                            await updatePushToken(token, "web"); // Explicitly web
                            sessionStorage.setItem(storageKey, token);
                            console.log("✅ Web FCM Token registered:", token);
                        } catch (e) {
                            console.error("Failed to register Web FCM token:", e);
                        }
                    }
                }
            } catch (err) {
                console.error("Error initializing web push:", err);
            }
        };

        // Run web push logic
        initWebPush();

        // 3. Foreground Listener (Suppress UI if handled by Realtime)
        if (messaging) {
            unsubscribeForeground = onMessage(messaging, (payload) => {
                console.log("Foreground Notification (FCM):", payload);
                window.dispatchEvent(new CustomEvent('push-received'));
            });
        }

        return () => {
            window.removeEventListener("FCM_TOKEN_READY", handleMobileEvent);
            if (unsubscribeForeground) unsubscribeForeground();
        };
    }, [user?.id, user?.isAdmin]); // Dependency on ID ensures re-run on login of different user

    const logout = async () => {
        try {
            await authLogout();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, refreshUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
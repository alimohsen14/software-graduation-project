import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import { User, getMe, logout as authLogout, updatePushToken } from "../services/authService";
import { onMessage } from "firebase/messaging";
import { initMessaging, getToken } from "../firebase";
import { toast } from "react-toastify";

interface AuthContextType {
    user: User | null | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    refreshUser: () => Promise<User | null>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: undefined,
    isAuthenticated: false,
    isLoading: true,
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
        const setupMessaging = async () => {
            const messagingInstance = await initMessaging();
            if (!messagingInstance) {
                console.log("🚫 Messaging not active (WebView or unsupported), skipping Web Push.");
                return null;
            }

            try {
                // Feature Support Check
                if (!("serviceWorker" in navigator) || !("Notification" in window)) {
                    return null;
                }

                // Request Permission
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') return null;

                // Get Web Token
                const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
                if (!vapidKey) {
                    console.warn("⚠️ REACT_APP_FIREBASE_VAPID_KEY not configured. Web push notifications disabled.");
                    return null;
                }

                const token = await getToken(messagingInstance, { vapidKey });
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

            // 3. Foreground Listener
            const unsubscribe = onMessage(messagingInstance, (payload) => {
                console.log("Foreground Notification (FCM):", payload);
                window.dispatchEvent(new CustomEvent('push-received'));
            });

            return unsubscribe;
        };

        const setupPromise = setupMessaging();

        return () => {
            window.removeEventListener("FCM_TOKEN_READY", handleMobileEvent);
            setupPromise.then(unsubscribe => {
                if (unsubscribe) unsubscribe();
            });
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
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading: user === undefined,
            refreshUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
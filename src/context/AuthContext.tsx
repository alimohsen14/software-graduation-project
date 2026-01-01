import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import { User, getMe, logout as authLogout } from "../services/authService";

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
import axios from "axios";

// ==========================================
// DYNAMIC API CONFIGURATION
// ==========================================
// Dynamically determine the API base URL based on the current hostname.
// This ensures that:
// - http://localhost:3001 targets http://localhost:3000
// - http://192.168.1.16:3001 targets http://192.168.1.16:3000
// - http://10.0.2.2:3001 targets http://10.0.2.2:3000
const getApiUrl = () => {
    if (typeof window === "undefined") return process.env.REACT_APP_API_URL || "http://localhost:3000";

    const host = window.location.hostname;
    // If we're on localhost, use localhost
    if (host === "localhost" || host === "127.0.0.1") {
        return "http://localhost:3000";
    }

    // Otherwise, target the same host on port 3000
    // This handles LAN IPs, Emulator IPs, and custom hostnames
    return `http://${host}:3000`;
};

const API_URL = getApiUrl();
console.log("Runtime API_URL:", API_URL);

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Response Interceptor for centralized error logging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            console.error(`API Error [${status}]:`, data?.message || error.message);
        } else if (error.request) {
            console.error("API Error: No response received", error.request);
        } else {
            console.error("API Error:", error.message);
        }
        return Promise.reject(error);
    }
);

// We export a 'publicApi' as well if you need unauthenticated requests specifically,
// but for now we follow the user request to provide a default export 'api'.
export const publicApi = api;

export default api;

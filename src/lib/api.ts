import axios from "axios";

// ==========================================
// CENTRALIZED API CONFIGURATION
// ==========================================
// All API requests use this single axios instance.
// The base URL is environment-driven for maximum flexibility:
//
// Local Dev:      VITE_API_URL=http://localhost:3000
// LAN/Mobile:     VITE_API_URL=http://192.168.1.16:3000
// Production:     VITE_API_URL=https://api.yourproductionsite.com
//
// This works seamlessly across:
// - Desktop browsers
// - Mobile browsers
// - React Native WebViews
// ==========================================

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.error(
        "❌ VITE_API_URL is not defined. Please check your .env file.\n" +
        "Example: VITE_API_URL=http://localhost:3000"
    );
}

console.log("✅ API configured:", API_URL);

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Required for cookie-based authentication
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

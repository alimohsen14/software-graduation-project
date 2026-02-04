import axios from "axios";

// ==========================================
// CENTRALIZED API CONFIGURATION
// ==========================================
// All API requests use this single axios instance.
// Local Dev:      REACT_APP_API_URL=http://localhost:3000
// Production:     REACT_APP_API_URL=https://software-graduation-project-backend.onrender.com
// ==========================================

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    console.error(
        "❌ REACT_APP_API_URL is not defined. Please check your .env file.\n" +
        "Example: REACT_APP_API_URL=https://software-graduation-project-backend.onrender.com"
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

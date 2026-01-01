import axios from "axios";

const API_URL = "http://localhost:3000";

// Authenticated client with cookie support
const client = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Public client for unauthenticated endpoints
export const publicClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// ==============================
// Response Interceptor: Error Logging Only
// ==============================
// NOTE: Do NOT redirect on 401 here - let route guards handle auth redirects.
// Global 401 redirects cause infinite loops with React Router.
const handleResponseError = (error: any) => {
    if (error.response) {
        const { status, data } = error.response;
        console.error(`API Error [${status}]:`, data?.message || error.message);
    } else if (error.request) {
        console.error("API Error: No response received", error.request);
    } else {
        console.error("API Error:", error.message);
    }
    return Promise.reject(error);
};

client.interceptors.response.use((response) => response, handleResponseError);
publicClient.interceptors.response.use((response) => response, handleResponseError);

export default client;

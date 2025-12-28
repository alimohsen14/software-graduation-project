import axios from "axios";

const API_URL = "http://localhost:3000";

const client = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ==============================
// Request Interceptor: Attach Token
// ==============================
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ==============================
// Response Interceptor: Error Handling
// ==============================
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            console.error(
                `API Error [${status}]:`,
                data?.message || error.message
            );

            if (status === 401) {
                // Optional logout handling
                // localStorage.removeItem("accessToken");
                // window.location.href = "/login";
            }
        } else if (error.request) {
            console.error("API Error: No response received", error.request);
        } else {
            console.error("API Error:", error.message);
        }

        return Promise.reject(error);
    }
);

export default client;

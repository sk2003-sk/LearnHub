
import axios from "axios";

const api = axios.create({
    baseURL: "https://mockapi-mauve.vercel.app",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(
            error,
            error.response?.status,
            error.response?.data
        );

        return Promise.reject(error);
    }
);

export default api;

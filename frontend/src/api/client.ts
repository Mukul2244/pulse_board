import axios from "axios";

export const apiClient = axios.create({
    baseURL: "https://pulseboard-production-defc.up.railway.app/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

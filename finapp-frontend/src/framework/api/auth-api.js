import axios from "axios";
import { showToast } from "../services/toast-service";
const authApi = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json"
    }
});

authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


authApi.interceptors.response.use(

    response => response,

    error => {

        if (error.response?.status === 401) {
            showToast(`${error.response.status}`, `${error.response.data.message}`, "danger");

            localStorage.removeItem("token");

            window.location.href = "/";
            alert(error.response.data.message);

        }

        return Promise.reject(error);
    });

export default authApi;
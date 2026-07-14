import axios from "axios";
import { showToast } from "../services/toast-service.js";
const expenseApi = axios.create({
    baseURL: "http://localhost:8001/api",
    headers: {
        "Content-Type": "application/json"
    }
});

expenseApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

expenseApi.interceptors.response.use(

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

export default expenseApi;
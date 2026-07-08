import api from "../framework/api/axios-config";

export const login = (data) => {
    return api.post("/auth/login", data);
};

export const register = (data) => {
    return api.post("/auth/register", data);
};
import authApi from "../framework/api/auth-api";
export const login = (data) => {
    return authApi.post("/auth/login", data);
};

export const register = (data) => {
    return authApi.post("/auth/register", data);
};
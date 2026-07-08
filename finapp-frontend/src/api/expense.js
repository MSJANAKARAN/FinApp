import api from "../framework/api/axios-config";

export const getExpenses = (type) => {
    return api.get(`/expenses?type=${type}`, {
        responseType: "blob"
    });
};


export const createExpense = (data) => {
    return api.post("/expenses", data);
};

export const updateExpense = (id, expense) => {
    return api.put(`/expenses/${id}`, expense);
};

export const deleteSelected = (ids) => {
    return api.post(`/expenses/delete`, ids);
}

export const deleteExpense = (id) => {
    return api.delete(`/expenses/${id}`);
}

export const getDashboardSummary = () => {
    return api.get("/expenses/dashboard/summary")
}

export const getMonthlyExpenses = (year, month) => api.get(`/expenses/month?year=${year}&month=${month}`);


export const getYearlyExpenses = (year) => api.get(`/expenses/year?year=${year}`);


export const getCustomExpenses = (from, to) => api.get(`/expenses/customdate?from=${from}&to=${to}`);
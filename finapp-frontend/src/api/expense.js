import expenseApi from "../framework/api/expense-api";

export const getExpenses = (type) => {
    return expenseApi.get(`/expenses?type=${type}`, {
        responseType: "blob"
    });
};


export const createExpense = (data) => {
    return expenseApi.post("/expenses", data);
};

export const updateExpense = (id, expense) => {
    return expenseApi.put(`/expenses/${id}`, expense);
};

export const deleteSelected = (ids) => {
    return expenseApi.post(`/expenses/delete`, ids);
}

export const deleteExpense = (id) => {
    return expenseApi.delete(`/expenses/${id}`);
}

export const getExpenseDashboardSummary = () => {
    return expenseApi.get("/expenses/dashboard/summary")
}

export const getMonthlyExpenses = (year, month) => expenseApi.get(`/expenses/month?year=${year}&month=${month}`);


export const getYearlyExpenses = (year) => expenseApi.get(`/expenses/year?year=${year}`);


export const getCustomExpenses = (from, to) => expenseApi.get(`/expenses/customdate?from=${from}&to=${to}`);
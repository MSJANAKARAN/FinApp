import api from "../framework/api/axios-config";

export const getPortfolioTransactions = () => api.get("/portfolio/transactions");

export const addTransaction = transaction => api.post("/portfolio/add", transaction);

export const updateTransaction = (id, transaction) => api.put(`/portfolio/update/${id}`, transaction);

export const deleteSelected = ids => api.post("/portfolio/delete", ids);

export const getPortfolioHoldings = () => api.get("/portfolio/holdings");
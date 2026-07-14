import portfolioApi from "../framework/api/portfolio-api";
export const getPortfolioTransactions = () => portfolioApi.get("/portfolio/transactions");

export const addTransaction = transaction => portfolioApi.post("/portfolio/add", transaction);

export const updateTransaction = (id, transaction) => portfolioApi.put(`/portfolio/update/${id}`, transaction);

export const deleteSelected = ids => portfolioApi.post("/portfolio/delete", ids);

export const getPortfolioHoldings = () => portfolioApi.get("/portfolio/holdings");

export const getPortfolioDashboardSummary = () => {
    return portfolioApi.get("/portfolio/dashboard/summary")
}

export const getPortfolioDetails = (type) => portfolioApi.get(`/portfolio/export?type=${type}`, {
    responseType: "blob"
});
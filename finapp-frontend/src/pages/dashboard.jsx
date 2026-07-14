import { useEffect, useState } from "react";
import { getExpenseDashboardSummary } from "../api/expense";
import { getPortfolioDashboardSummary } from "../api/portfolio";
import DashboardCard from "../components/dashboard-card";
import Navbar from "../components/navbar";
import { formatCurrency } from "../framework/utils/formatters";

function Dashboard() {

    const [expenseSummary, setExpenseSummary] = useState(null);
    const [portfolioSummary, setPortfolioSummary] = useState(null);
  
    useEffect(() => {
        loadExpenseDashboard();
        loadPortfolioDashboard();
    }, []);

    const loadExpenseDashboard = async () => {
        try {
            const response = await getExpenseDashboardSummary();

            setExpenseSummary(
                response.data
            );
        } catch (error) {
            console.error(error);
        }
    };

    const loadPortfolioDashboard = async () => {
        try {
            const response = await getPortfolioDashboardSummary();

            setPortfolioSummary(
                response.data
            );
        } catch (error) {
            console.error(error);
        }
    };

    if (!expenseSummary && !portfolioSummary) {
        return <h4>
            Loading... Kindly wait for sometime or try again later
        </h4>;
    }

    return (

        <div className="container mt-4">

            <Navbar title="FinApp Dashboard">
            </Navbar>
            {expenseSummary &&
                <div className="mt-3">
                    <div className="col-md-12 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-body header-card-bg">
                                <h4>Expense Dashboard</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row my-3">
                        <DashboardCard
                            title="Total Transactions"
                            value={
                                expenseSummary.totalTransactions
                            } />

                        <DashboardCard
                            title="Total Expense"
                            value={
                                formatCurrency(
                                    expenseSummary.totalExpense
                                )
                            } />

                        <DashboardCard
                            title="Weekly Expense"
                            value={
                                formatCurrency(
                                    expenseSummary.weeklyExpense
                                )} />

                        <DashboardCard
                            title="Monthly Expense"
                            value={
                                formatCurrency(
                                    expenseSummary.monthlyExpense
                                )
                            } />

                        <DashboardCard
                            title="Yearly Expense"
                            value={
                                formatCurrency(
                                    expenseSummary.yearlyExpense
                                )
                            } />

                        <DashboardCard
                            title="Highest Expense"
                            value={
                                formatCurrency(
                                    expenseSummary.highestExpense
                                )
                            } />

                        <DashboardCard
                            title="Top Category"
                            value={
                                expenseSummary.topCategory
                            } />

                        <DashboardCard
                            title="Budget Usage %"
                            value={
                                expenseSummary.currentMonthBudgetUsage
                            } />
                    </div>
                </div>
            }
            {portfolioSummary &&
                <div className="mt-3">
                    <div className="col-md-12 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-body header-card-bg">
                                <h4>Holdings Dashboard</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row my-3">
                        <DashboardCard
                            title="Total Holdings"
                            value={
                                portfolioSummary.totalHoldings
                            } />

                        <DashboardCard
                            title="Total Invested"
                            value={
                                formatCurrency(
                                    portfolioSummary.totalInvested
                                )
                            } />

                        <DashboardCard
                            title="Buy Transactions"
                            value={
                                portfolioSummary.buyTransactions
                            } />

                        <DashboardCard
                            title="Sell Transactions"
                            value={
                                portfolioSummary.sellTransactions

                            } />

                        <DashboardCard
                            title="Weekly Investment"
                            value={
                                formatCurrency(
                                    portfolioSummary.weeklyInvestment
                                )
                            } />

                        <DashboardCard
                            title="Monthly Investment"
                            value={
                                formatCurrency(
                                    portfolioSummary.monthlyInvestment
                                )
                            } />

                        <DashboardCard
                            title="Yearly Investment"
                            value={formatCurrency(
                                portfolioSummary.yearlyInvestment)
                            } />

                        <DashboardCard
                            title="Highest Investment"
                            value={formatCurrency(
                                portfolioSummary.highestInvestment)
                            } />
                    </div>
                </div>
            }
        </div>
    );
}

export default Dashboard;
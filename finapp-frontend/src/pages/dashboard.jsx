import { useEffect, useState } from "react";
import { formatCurrency } from "../framework/utils/formatters";
import DashboardCard from "../components/dashboard-card";
import { getDashboardSummary } from "../api/expense";
import { getPortfolioHoldings } from "../api/portfolio";
import Navbar from "../components/navbar";

function Dashboard() {

    const [summary, setSummary] = useState(null);

    useEffect(() => {
        loadExpenseDashboard();
        loadPortfolioDashboard();
    }, []);

    const loadExpenseDashboard = async () => {
        try {
            const response = await getDashboardSummary();

            setSummary(
                response.data
            );
        } catch (error) {
            console.error(error);
        }
    };

    const loadPortfolioDashboard = async () => {
        try {
            const response = await getPortfolioHoldings();

            setSummary(
                response.data
            );
        } catch (error) {
            console.error(error);
        }
    };

    if (!summary) {

        return <h4>
            Loading...
        </h4>;
    }

    return (

        <div className="container mt-4">

            <Navbar title="FinApp Dashboard">
            </Navbar>

            <div className="mt-3">
                <div className="col-md-12 mb-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4>Expense Dashboard</h4>
                        </div>
                    </div>
                </div>
                <div className="row my-3">
                    <DashboardCard
                        title="Total Transactions"
                        value={
                            summary.totalTransactions
                        } />

                    <DashboardCard
                        title="Total Expense"
                        value={
                            formatCurrency(
                                summary.totalExpense
                            )
                        } />

                    <DashboardCard
                        title="Weekly Expense"
                        value={
                            formatCurrency(
                                summary.weeklyExpense
                            )} />

                    <DashboardCard
                        title="Monthly Expense"
                        value={
                            formatCurrency(
                                summary.monthlyExpense
                            )
                        } />

                    <DashboardCard
                        title="Yearly Expense"
                        value={
                            formatCurrency(
                                summary.yearlyExpense
                            )
                        } />

                    <DashboardCard
                        title="Highest Expense"
                        value={
                            formatCurrency(
                                summary.highestExpense
                            )
                        } />

                    <DashboardCard
                        title="Top Category"
                        value={
                            summary.topCategory
                        } />

                    <DashboardCard
                        title="Budget Usage %"
                        value={
                            summary.currentMonthBudgetUsage
                        } />
                </div>
                  <div className="col-md-12 mb-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4>Holdings Dashboard</h4>
                        </div>
                    </div>
                </div>
                <div className="row my-3">
                    <DashboardCard
                        title="Total Transactions"
                        value={
                            summary.totalTransactions
                        } />

                    <DashboardCard
                        title="Total Expense"
                        value={
                            formatCurrency(
                                summary.totalExpense
                            )
                        } />

                    <DashboardCard
                        title="Weekly Expense"
                        value={
                            formatCurrency(
                                summary.weeklyExpense
                            )} />

                    <DashboardCard
                        title="Monthly Expense"
                        value={
                            formatCurrency(
                                summary.monthlyExpense
                            )
                        } />

                    <DashboardCard
                        title="Yearly Expense"
                        value={
                            formatCurrency(
                                summary.yearlyExpense
                            )
                        } />

                    <DashboardCard
                        title="Highest Expense"
                        value={
                            formatCurrency(
                                summary.highestExpense
                            )
                        } />

                    <DashboardCard
                        title="Top Category"
                        value={
                            summary.topCategory
                        } />

                    <DashboardCard
                        title="Budget Usage %"
                        value={
                            summary.currentMonthBudgetUsage
                        } />
                </div>


            </div>

        </div>
    );
}

export default Dashboard;
import { useEffect, useState } from "react";
import { formatCurrency } from "../framework/utils/formatters";
import DashboardCard from "../components/dashboard-card";
import { getDashboardSummary } from "../api/expense";
import Navbar from "../components/navbar";

function Dashboard() {

    const [summary,
        setSummary]
        = useState(null);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard =
        async () => {

            try {

                const response =
                    await getDashboardSummary();

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
            <div className="row">

                <DashboardCard
                    title="Total Transactions"
                    value={
                        summary.totalTransactions
                    }
                />

                <DashboardCard
                    title="Total Expense"
                    value={
                        formatCurrency(
                            summary.totalExpense
                        )
                    }
                />

                <DashboardCard
                    title="Weekly Expense"
                    value={
                        formatCurrency(
                            summary.weeklyExpense
                        )}
                />

                <DashboardCard
                    title="Monthly Expense"
                    value={
                        formatCurrency(
                            summary.monthlyExpense
                        )
                    }
                />

                <DashboardCard
                    title="Yearly Expense"
                    value={
                        formatCurrency(
                            summary.yearlyExpense
                        )
                    }
                />

                <DashboardCard
                    title="Highest Expense"
                    value={
                        formatCurrency(
                            summary.highestExpense
                        )
                    }
                />

                <DashboardCard
                    title="Top Category"
                    value={
                        summary.topCategory
                    }
                />

                <DashboardCard
                    title="Budget Usage %"
                    value={
                        summary.currentMonthBudgetUsage
                    }
                />

            </div>

        </div>
    );
}

export default Dashboard;
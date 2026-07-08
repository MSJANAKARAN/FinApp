package com.fin.app.main.projection;

import java.math.BigDecimal;

public interface DashboardMetricsProjection {

	Long getTotalTransactions();

	BigDecimal getTotalExpense();

	Long getWeeklyTransactions();

	Long getMonthlyTransactions();

	Long getYearlyTransactions();

	BigDecimal getWeeklyExpense();

	BigDecimal getMonthlyExpense();

	BigDecimal getYearlyExpense();

	BigDecimal getHighestExpense();
}
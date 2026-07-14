package com.fin.app.main.dto.dashboard;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExpenseDashboardDto {

	private Long totalTransactions;
    private BigDecimal totalExpense;
    
    private Long weeklyTransactions;
    private Long monthlyTransactions;
    private Long yearlyTransactions;

    private BigDecimal weeklyExpense;
    private BigDecimal monthlyExpense;
    private BigDecimal yearlyExpense;

    private String topCategory;

    private BigDecimal averageDailySpend;

    private BigDecimal highestExpense;

	private BigDecimal currentMonthBudgetUsage;
}
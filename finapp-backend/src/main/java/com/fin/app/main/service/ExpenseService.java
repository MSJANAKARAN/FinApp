package com.fin.app.main.service;

import java.time.LocalDate;
import java.util.List;

import com.fin.app.main.dto.dashboard.DashboardSummaryDto;
import com.fin.app.main.dto.expense.ExpenseRequestDto;
import com.fin.app.main.dto.expense.ExpenseResponseDto;
import com.fin.app.main.entity.Expense;

public interface ExpenseService {

    Expense createExpense(
            String email,
            ExpenseRequestDto dto);

    List<Expense> getExpenses(
            String email);

    DashboardSummaryDto getDashboardSummary(String email);

    ExpenseResponseDto updateExpense(String email, Long expenseId, ExpenseRequestDto dto);

    void deleteExpense(String email, Long expenseId);

    ExpenseResponseDto deleteSelected(String email, List<Long> expenseIds);

    List<ExpenseResponseDto> getMonthlyExpenses(
            String email,
            int year,
            int month);

    List<ExpenseResponseDto> getYearlyExpenses(
            String email,
            int year);

    List<ExpenseResponseDto> getCustomExpenses(
            String email,
            LocalDate from,
            LocalDate to);

    
}
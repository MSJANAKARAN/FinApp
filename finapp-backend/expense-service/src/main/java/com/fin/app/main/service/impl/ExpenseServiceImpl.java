package com.fin.app.main.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.fin.app.main.dto.dashboard.ExpenseDashboardDto;
import com.fin.app.main.dto.expense.ExpenseRequestDto;
import com.fin.app.main.dto.expense.ExpenseResponseDto;
import com.fin.app.main.entity.Budget;
import com.fin.app.main.entity.Expense;
import com.fin.app.main.projection.DashboardMetricsProjection;
import com.fin.app.main.repository.BudgetRepository;
import com.fin.app.main.repository.ExpenseRepository;
import com.fin.app.main.service.ExpenseService;

import jakarta.transaction.Transactional;

@Service
public class ExpenseServiceImpl implements ExpenseService {

	private final ExpenseRepository expenseRepository;
	private final BudgetRepository budgetRepository;

	public ExpenseServiceImpl(ExpenseRepository expenseRepository,BudgetRepository budgetRepository) {

		this.expenseRepository = expenseRepository;
		this.budgetRepository = budgetRepository;
	}

	@Override
	public Expense createExpense(String email, ExpenseRequestDto dto) {

		Expense expense = new Expense();

		expense.setEmail(email);
		expense.setPaymentType(dto.getPaymentType());
		expense.setCategory(dto.getCategory());
		expense.setDescription(dto.getDescription());
		expense.setAmount(dto.getAmount());
		expense.setExpenseDate(dto.getExpenseDate());

		return expenseRepository.save(expense);
	}

	@Override
	public List<Expense> getExpenses(String email) {

		return expenseRepository.findByEmailOrderByExpenseDateDesc(email);
	}

	@Override
	@Transactional
	public ExpenseResponseDto updateExpense(
			String email,
			Long expenseId,
			ExpenseRequestDto dto) {
		Expense expense = expenseRepository
				.findByExpenseIdAndEmail(expenseId, email)
				.orElseThrow(() -> new RuntimeException("Expense not found"));

		expense.setCategory(
				dto.getCategory());

		expense.setDescription(
				dto.getDescription());

		expense.setAmount(
				dto.getAmount());

		expense.setPaymentType(
				dto.getPaymentType());

		expense.setExpenseDate(
				dto.getExpenseDate());

		Expense updated = expenseRepository.save(expense);

		return new ExpenseResponseDto(updated);
	}

	@Override
	@Transactional
	public void deleteExpense(
			String email,
			Long expenseId) {

		Expense expense = expenseRepository
				.findByExpenseIdAndEmail(expenseId, email)
				.orElseThrow(() -> new RuntimeException("Expense not found"));

		expenseRepository.delete(expense);
	}

	@Override
	@Transactional
	public ExpenseResponseDto deleteSelected(
			String email,
			List<Long> expenseIds) {
		List<Expense> expenses = expenseRepository.findByExpenseIdInAndEmail(
				expenseIds,
				email);

		String expenseDeleted;

		if (expenses.isEmpty()) {
			throw new RuntimeException("No expenses found for deletion.");
		}

		expenseRepository.deleteAll(expenses);

		if (expenseIds.size() != expenses.size()) {
			expenseDeleted = "Some expenses not found for deletion. Deleted expense Ids: "
					+ expenses.stream().map(id -> id.getExpenseId()).collect(Collectors.toList()).toString();
		} else {
			expenseDeleted = "Deleted expense Ids: "
					+ expenses.stream().map(id -> id.getExpenseId()).collect(Collectors.toList()).toString();
		}

		return new ExpenseResponseDto(expenseDeleted);
	}

	@Override
	public ExpenseDashboardDto getDashboardSummary(String email) {

		DashboardMetricsProjection metrics = expenseRepository.getDashboardMetrics(email);

		String topCategory = expenseRepository.findTopCategory(email);

		BigDecimal averageDailySpend = BigDecimal.ZERO;

		if (metrics.getMonthlyExpense() != null) {

			averageDailySpend = metrics.getMonthlyExpense().divide(BigDecimal.valueOf(LocalDate.now().getDayOfMonth()),
					2, RoundingMode.HALF_UP);
		}

		BigDecimal budgetUsage = BigDecimal.ZERO;

		Optional<Budget> budget = budgetRepository.findByEmail(email);

		if (budget.isPresent()) {

			budgetUsage = metrics.getMonthlyExpense().multiply(BigDecimal.valueOf(100))
					.divide(budget.get().getMonthlyBudget(), 2, RoundingMode.HALF_UP);
		}

		return new ExpenseDashboardDto(metrics.getTotalTransactions(), metrics.getTotalExpense(),
				metrics.getWeeklyTransactions(), metrics.getMonthlyTransactions(), metrics.getYearlyTransactions(),
				metrics.getWeeklyExpense(), metrics.getMonthlyExpense(), metrics.getYearlyExpense(), topCategory,
				averageDailySpend, metrics.getHighestExpense(), budgetUsage);
	}

	@Override
	public List<ExpenseResponseDto> getMonthlyExpenses(
			String email,
			int year,
			int month) {

		LocalDate startDate = LocalDate.of(year, month, 1);

		LocalDate endDate = startDate.withDayOfMonth(
				startDate.lengthOfMonth());

		return expenseRepository
				.findExpensesBetween(
						email,
						startDate,
						endDate)
				.stream()
				.map(this::mapToDto)
				.toList();
	}

	@Override
	public List<ExpenseResponseDto> getYearlyExpenses(
			String email,
			int year) {

		LocalDate startDate = LocalDate.of(year, 1, 1);

		LocalDate endDate = LocalDate.of(year, 12, 31);

		return expenseRepository
				.findExpensesBetween(
						email,
						startDate,
						endDate)
				.stream()
				.map(this::mapToDto)
				.toList();
	}

	@Override
	public List<ExpenseResponseDto> getCustomExpenses(
			String email,
			LocalDate from,
			LocalDate to) {

		return expenseRepository
				.findExpensesBetween(
						email,
						from,
						to)
				.stream()
				.map(this::mapToDto)
				.toList();
	}

	private ExpenseResponseDto mapToDto(Expense expense) {
		return new ExpenseResponseDto(expense);
	}

}
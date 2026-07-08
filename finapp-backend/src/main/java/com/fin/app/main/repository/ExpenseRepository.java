package com.fin.app.main.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fin.app.main.entity.Expense;
import com.fin.app.main.projection.DashboardMetricsProjection;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
	@Query(value = """
			SELECT

			COUNT(*) AS totalTransactions,

			COALESCE(SUM(amount),0) AS totalExpense,

			COUNT(
			    CASE
			        WHEN expense_date >= CURRENT_DATE - INTERVAL '6 days'
			        THEN 1
			    END
			) AS weeklyTransactions,

			COUNT(
			    CASE
			        WHEN DATE_TRUNC('month', expense_date)
			             = DATE_TRUNC('month', CURRENT_DATE)
			        THEN 1
			    END
			) AS monthlyTransactions,

			COUNT(
			    CASE
			        WHEN DATE_TRUNC('year', expense_date)
			             = DATE_TRUNC('year', CURRENT_DATE)
			        THEN 1
			    END
			) AS yearlyTransactions,

			COALESCE(
			SUM(
			    CASE
			        WHEN expense_date >= CURRENT_DATE - INTERVAL '6 days'
			        THEN amount
			    END
			),0) AS weeklyExpense,

			COALESCE(
			SUM(
			    CASE
			        WHEN DATE_TRUNC('month', expense_date)
			             = DATE_TRUNC('month', CURRENT_DATE)
			        THEN amount
			    END
			),0) AS monthlyExpense,

			COALESCE(
			SUM(
			    CASE
			        WHEN DATE_TRUNC('year', expense_date)
			             = DATE_TRUNC('year', CURRENT_DATE)
			        THEN amount
			    END
			),0) AS yearlyExpense,

			COALESCE(MAX(amount),0) AS highestExpense

			FROM expenses e
			JOIN users u
			ON e.user_id = u.user_id

			WHERE u.email = :email
			""", nativeQuery = true)
	DashboardMetricsProjection getDashboardMetrics(@Param("email") String email);

	@Query(value = """
			SELECT category
			FROM expenses e
			JOIN users u
			ON e.user_id = u.user_id

			WHERE u.email = :email

			GROUP BY category

			ORDER BY SUM(amount) DESC

			LIMIT 1
			""", nativeQuery = true)
	String findTopCategory(@Param("email") String email);

	List<Expense> findByUserEmailOrderByExpenseDateDesc(String email);

	Optional<Expense> findByExpenseIdAndEmail(Long expenseId, String email);

	List<Expense> findByExpenseIdInAndEmail(List<Long> expenseIds, String email);

	@Query("""
			    SELECT e
			    FROM Expense e
			    WHERE e.user.email = :email
			      AND e.expenseDate BETWEEN :startDate AND :endDate
			    ORDER BY e.expenseDate DESC
			""")
	List<Expense> findExpensesBetween(
			@Param("email") String email,
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate);
}
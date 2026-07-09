package com.fin.app.main.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fin.app.main.dto.dashboard.DashboardSummaryDto;
import com.fin.app.main.dto.expense.ExpenseRequestDto;
import com.fin.app.main.dto.expense.ExpenseResponseDto;
import com.fin.app.main.entity.Expense;
import com.fin.app.main.service.ExpenseService;
import com.fin.app.main.service.ReportService;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

	private final ExpenseService expenseService;
	private final ReportService reportService;

	public ExpenseController(ExpenseService expenseService, ReportService reportService) {

		this.expenseService = expenseService;
		this.reportService = reportService;
	}

	@PostMapping
	public Expense createExpense(@RequestBody ExpenseRequestDto dto, Authentication authentication) {

		return expenseService.createExpense(authentication.getName(), dto);
	}

	@GetMapping
	public ResponseEntity<byte[]> getExpenses(Authentication authentication, @RequestParam String type) throws Exception {

		List<Expense> expenses = expenseService.getExpenses(authentication.getName());

		if (type.equalsIgnoreCase("csv")) {
			byte[] csv = reportService.generateExpenseCSV(authentication, expenses);

			return ResponseEntity.ok()
					.header(
							HttpHeaders.CONTENT_DISPOSITION,
							"attachment; filename=expense_report.csv")
					.contentType(MediaType.TEXT_PLAIN)
					.body(csv);
		} else if (type.equalsIgnoreCase("pdf")) {
			byte[] pdf = reportService.generateExpensePDF(authentication, expenses);

			return ResponseEntity.ok()
					.header(
							HttpHeaders.CONTENT_DISPOSITION,
							"attachment; filename=expense_report.pdf")
					.contentType(MediaType.APPLICATION_PDF)
					.body(pdf);
		} else if (type.equalsIgnoreCase("xlsx")) {
			byte[] xlsx = reportService.generateExpenseExcel(authentication, expenses);

			return ResponseEntity.ok()
					.header(
							HttpHeaders.CONTENT_DISPOSITION,
							"attachment; filename=expense_report.xlsx")
					.contentType(
                    MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
					.body(xlsx);
		}
		return (ResponseEntity<byte[]>) null;
	}

	@PutMapping("/{expenseId}")
	public ResponseEntity<ExpenseResponseDto> updateExpense(
			@PathVariable Long expenseId,
			@RequestBody ExpenseRequestDto dto,
			Authentication authentication) {

		ExpenseResponseDto response = expenseService.updateExpense(
				authentication.getName(),
				expenseId,
				dto);

		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{expenseId}")
	public ResponseEntity<String> deleteExpense(
			@PathVariable Long expenseId,
			Authentication authentication) {

		expenseService.deleteExpense(
				authentication.getName(),
				expenseId);

		return ResponseEntity.ok(
				"Expense deleted successfully");
	}

	@GetMapping("/dashboard/summary")
	public DashboardSummaryDto getSummary(
			Authentication authentication) {

		return expenseService.getDashboardSummary(
				authentication.getName());
	}

	@PostMapping("/delete")
	public ResponseEntity<ExpenseResponseDto> deleteSelected(@RequestBody List<Long> expenseIds,
			Authentication authentication) {

		ExpenseResponseDto response = expenseService.deleteSelected(authentication.getName(), expenseIds);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/month")
	public ResponseEntity<List<ExpenseResponseDto>> getMonthlyExpenses(
			Authentication authentication,
			@RequestParam int year,
			@RequestParam int month) {

		return ResponseEntity.ok(
				expenseService.getMonthlyExpenses(
						authentication.getName(),
						year,
						month));
	}

	@GetMapping("/year")
	public ResponseEntity<List<ExpenseResponseDto>> getYearlyExpenses(
			Authentication authentication,
			@RequestParam int year) {

		return ResponseEntity.ok(
				expenseService.getYearlyExpenses(
						authentication.getName(),
						year));
	}

	@GetMapping("/customdate")
	public ResponseEntity<List<ExpenseResponseDto>> getCustomExpenses(
			Authentication authentication,
			@RequestParam LocalDate from,
			@RequestParam LocalDate to) {

		return ResponseEntity.ok(
				expenseService.getCustomExpenses(
						authentication.getName(),
						from,
						to));
	}
}
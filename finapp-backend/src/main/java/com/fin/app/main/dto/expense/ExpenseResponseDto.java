package com.fin.app.main.dto.expense;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fin.app.main.entity.Expense;

import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class ExpenseResponseDto {

    private Long expenseId;
    private String description;
    private String category;
    private BigDecimal amount;
    private String paymentType;
    private LocalDate expenseDate;
    private String message;

    public ExpenseResponseDto(String message) {
        this.message = message;
    }

    public ExpenseResponseDto(Expense updated) {
        this.expenseId = updated.getExpenseId();
        this.description = updated.getDescription();
        this.category = updated.getCategory();
        this.amount = updated.getAmount();
        this.paymentType = updated.getPaymentType();
        this.expenseDate = updated.getExpenseDate();
    }

}

package com.fin.app.main.dto.expense;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class ExpenseRequestDto {

    private String category;

    private String paymentType;

    private String description;

    private BigDecimal amount;

    private LocalDate expenseDate;
    
    
}
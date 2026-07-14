package com.fin.app.main.dto.portfolio;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fin.app.main.constants.TransactionType;

import lombok.Data;

@Data
public class PortfolioTransactionRequestDto {

    private String symbol;

    private String companyName;

    private String assetType;

    private TransactionType transactionType;

    private BigDecimal quantity;

    private BigDecimal price;

    private LocalDate transactionDate;

}

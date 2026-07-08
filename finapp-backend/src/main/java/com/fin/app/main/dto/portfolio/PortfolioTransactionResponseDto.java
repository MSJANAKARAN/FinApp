package com.fin.app.main.dto.portfolio;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fin.app.main.constants.TransactionType;
import com.fin.app.main.entity.PortfolioTransaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PortfolioTransactionResponseDto {

    private Long transactionId;

    private String symbol;

    private String companyName;

    private String assetType;

    private TransactionType transactionType;

    private BigDecimal quantity;

    private BigDecimal price;

    private LocalDate transactionDate;

    public PortfolioTransactionResponseDto(PortfolioTransaction updated) {
        this.transactionId = updated.getTransactionId();
        this.symbol = updated.getSymbol();
        this.companyName = updated.getCompanyName();
        this.assetType = updated.getAssetType();
        this.transactionType = updated.getTransactionType();
        this.quantity = updated.getQuantity();
        this.price = updated.getPrice();
        this.transactionDate = updated.getTransactionDate();
    }

}

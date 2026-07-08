package com.fin.app.main.dto.portfolio;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HoldingDto {

    private String stockSymbol;

    private String companyName;

    private BigDecimal quantity;

    private BigDecimal averagePrice;

    private BigDecimal investedAmount;

}
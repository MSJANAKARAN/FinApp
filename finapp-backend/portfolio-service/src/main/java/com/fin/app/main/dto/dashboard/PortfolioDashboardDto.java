package com.fin.app.main.dto.dashboard;
import java.math.BigDecimal;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class PortfolioDashboardDto {

    private Long totalHoldings;

    private BigDecimal totalInvested;

    private Long buyTransactions;

    private Long sellTransactions;

    private BigDecimal weeklyInvestment;

    private BigDecimal monthlyInvestment;

    private BigDecimal yearlyInvestment;

    private BigDecimal highestInvestment;

}
package com.fin.app.main.projection;

import java.math.BigDecimal;

public interface PortfolioDashboardProjection {

    Long getTotalHoldings();

    BigDecimal getTotalInvested();

    Long getBuyTransactions();

    Long getSellTransactions();

    BigDecimal getWeeklyInvestment();

    BigDecimal getMonthlyInvestment();

    BigDecimal getYearlyInvestment();

    BigDecimal getHighestInvestment();
}
package com.fin.app.main.projection;

import java.math.BigDecimal;

public interface PortfolioHoldingProjection {

    String getSymbol();

    String getCompanyName();

    BigDecimal getQuantity();

    BigDecimal getInvestedAmount();
}
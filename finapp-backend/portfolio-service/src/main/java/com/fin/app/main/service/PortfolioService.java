package com.fin.app.main.service;

import java.util.List;

import com.fin.app.main.dto.common.ApiResponseDto;
import com.fin.app.main.dto.dashboard.PortfolioDashboardDto;
import com.fin.app.main.dto.portfolio.HoldingDto;
import com.fin.app.main.dto.portfolio.PortfolioTransactionRequestDto;
import com.fin.app.main.dto.portfolio.PortfolioTransactionResponseDto;
import com.fin.app.main.entity.PortfolioTransaction;

public interface PortfolioService {

        PortfolioTransaction addTransaction(
                        String email,
                        PortfolioTransactionRequestDto dto);

        List<PortfolioTransaction> getTransactions(String email);

        PortfolioTransactionResponseDto updateTransaction(
                        String email,
                        Long transactionId,
                        PortfolioTransactionRequestDto dto);

        ApiResponseDto deleteSelected(
                        String email,
                        List<Long> ids);

        List<HoldingDto> getHoldings(String email);

        PortfolioDashboardDto getDashboardSummary(String email);
}
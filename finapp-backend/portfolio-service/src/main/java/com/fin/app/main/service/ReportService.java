package com.fin.app.main.service;

import java.io.IOException;
import java.util.List;

import org.springframework.security.core.Authentication;

import com.fin.app.main.dto.portfolio.HoldingDto;
import com.fin.app.main.entity.PortfolioTransaction;

public interface ReportService {

    byte[] generatePortfolioPDF(Authentication authentication, List<PortfolioTransaction> transactions,
            List<HoldingDto> holdings) throws Exception;

    byte[] generatePortfolioExcel(Authentication authentication, List<PortfolioTransaction> transactions,
            List<HoldingDto> holdings) throws IOException;

    byte[] generatePortfolioCSV(Authentication authentication, List<PortfolioTransaction> transactions,
            List<HoldingDto> holdings) throws Exception;

}

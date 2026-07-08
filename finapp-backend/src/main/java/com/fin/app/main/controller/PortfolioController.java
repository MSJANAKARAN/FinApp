package com.fin.app.main.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fin.app.main.dto.common.ApiResponseDto;
import com.fin.app.main.dto.portfolio.HoldingDto;
import com.fin.app.main.dto.portfolio.PortfolioTransactionRequestDto;
import com.fin.app.main.dto.portfolio.PortfolioTransactionResponseDto;
import com.fin.app.main.entity.PortfolioTransaction;
import com.fin.app.main.service.PortfolioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

        private final PortfolioService portfolioService;

        public PortfolioController(
                        PortfolioService portfolioService) {

                this.portfolioService = portfolioService;
        }

        @GetMapping("/transactions")
        public ResponseEntity<List<PortfolioTransaction>> transactions(Authentication authentication) {

                return ResponseEntity.ok(portfolioService.getTransactions(
                                authentication.getName()));
        }

        @PostMapping("/add")
        public ResponseEntity<PortfolioTransaction> addTransaction(
                        @RequestBody PortfolioTransactionRequestDto dto,
                        Authentication authentication) {

                return ResponseEntity.ok(portfolioService.addTransaction(authentication.getName(), dto));
        }

        @PutMapping("/update/{transactionId}")
        public ResponseEntity<PortfolioTransactionResponseDto> updateTransaction(@PathVariable Long transactionId,
                        @RequestBody @Valid PortfolioTransactionRequestDto dto, Authentication authentication) {

                return ResponseEntity.ok(
                                portfolioService.updateTransaction(authentication.getName(), transactionId, dto));
        }

        @PostMapping("/delete")
        public ResponseEntity<ApiResponseDto> deleteSelected(Authentication authentication,
                        @RequestBody List<Long> ids) {

                return ResponseEntity.ok(portfolioService.deleteSelected(authentication.getName(), ids));
        }

        @GetMapping("/holdings")
        public ResponseEntity<List<HoldingDto>> holdings(Authentication authentication) {

                return ResponseEntity.ok(portfolioService.getHoldings(
                                authentication.getName()));
        }
}
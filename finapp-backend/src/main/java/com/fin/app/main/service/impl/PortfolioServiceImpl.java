package com.fin.app.main.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fin.app.main.dto.common.ApiResponseDto;
import com.fin.app.main.dto.portfolio.HoldingDto;
import com.fin.app.main.dto.portfolio.PortfolioTransactionRequestDto;
import com.fin.app.main.dto.portfolio.PortfolioTransactionResponseDto;
import com.fin.app.main.entity.PortfolioTransaction;
import com.fin.app.main.projection.PortfolioHoldingProjection;
import com.fin.app.main.repository.PortfolioHoldingRepository;
import com.fin.app.main.repository.PortfolioTransactionRepository;
import com.fin.app.main.service.PortfolioService;

import jakarta.transaction.Transactional;

@Service
public class PortfolioServiceImpl implements PortfolioService {

	private final PortfolioTransactionRepository transactionRepository;

	private final PortfolioHoldingRepository holdingRepository;

	public PortfolioServiceImpl(PortfolioTransactionRepository transactionRepository,
			PortfolioHoldingRepository holdingRepository) {

		this.transactionRepository = transactionRepository;
		this.holdingRepository = holdingRepository;
	}

	@Override
	public PortfolioTransaction addTransaction(String email, PortfolioTransactionRequestDto dto) {

		PortfolioTransaction tx = new PortfolioTransaction();

		tx.setEmail(email);

		tx.setSymbol(dto.getSymbol());

		tx.setCompanyName(dto.getCompanyName());
		tx.setAssetType(dto.getAssetType());

		tx.setTransactionType(dto.getTransactionType());

		tx.setQuantity(dto.getQuantity());

		tx.setPrice(dto.getPrice());

		tx.setTransactionDate(dto.getTransactionDate());

		return transactionRepository.save(tx);
	}

	@Override
	public List<PortfolioTransaction> getTransactions(String email) {

		return transactionRepository.findByEmail(email);
	}

	@Override
	public List<HoldingDto> getHoldings(String email) {

		List<PortfolioHoldingProjection> holdings = holdingRepository.getHoldings(email);

		return holdings.stream().map(h -> {

			BigDecimal avgCost = BigDecimal.ZERO;

			if (h.getQuantity().compareTo(BigDecimal.ZERO) > 0) {

				avgCost = h.getInvestedAmount().divide(h.getQuantity(), 2, RoundingMode.HALF_UP);
			}

			return new HoldingDto(h.getSymbol(), h.getCompanyName(), h.getQuantity(), avgCost,
					h.getInvestedAmount());
		}).toList();
	}

	@Override
	@Transactional
	public PortfolioTransactionResponseDto updateTransaction(
			String email,
			Long transactionId,
			PortfolioTransactionRequestDto dto) {

		PortfolioTransaction transaction = transactionRepository
				.findByTransactionIdAndEmail(transactionId, email)
				.orElseThrow(() -> new RuntimeException("Portfolio transaction not found."));

		transaction.setSymbol(dto.getSymbol());
		transaction.setCompanyName(dto.getCompanyName());
		transaction.setAssetType(dto.getAssetType());
		transaction.setTransactionType(dto.getTransactionType());
		transaction.setQuantity(dto.getQuantity());
		transaction.setPrice(dto.getPrice());

		if (dto.getTransactionDate() != null) {
			transaction.setTransactionDate(dto.getTransactionDate());
		}

		PortfolioTransaction updated = transactionRepository.save(transaction);

		return new PortfolioTransactionResponseDto(updated);
	}

	@Override
	@Transactional
	public ApiResponseDto deleteSelected(String email, List<Long> ids) {  List<PortfolioTransaction> transactions =
            transactionRepository.findByTransactionIdInAndEmail(ids, email);

    if (transactions.isEmpty()) {
        throw new RuntimeException(
                "No portfolio transactions found.");
    }

    if (transactions.size() != ids.size()) {
        throw new RuntimeException(
                "One or more selected transactions were not found.");
    }

    transactionRepository.deleteAll(transactions);

    return new ApiResponseDto(
            true,
            "Deleted transaction Ids: " + ids);
	}
}
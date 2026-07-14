package com.fin.app.main.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fin.app.main.entity.PortfolioTransaction;

public interface PortfolioTransactionRepository
        extends JpaRepository<PortfolioTransaction, Long> {

    List<PortfolioTransaction> findByEmailOrderBySymbol(String email);

    List<PortfolioTransaction> findByEmailOrderByTransactionDateDesc(String email);

    Optional<PortfolioTransaction> findByTransactionIdAndEmail(Long transactionId, String email);

    List<PortfolioTransaction> findByTransactionIdInAndEmail(List<Long> ids, String email);
}
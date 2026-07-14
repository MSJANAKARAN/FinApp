package com.fin.app.main.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fin.app.main.entity.PortfolioHolding;
import com.fin.app.main.projection.PortfolioDashboardProjection;
import com.fin.app.main.projection.PortfolioHoldingProjection;

public interface PortfolioHoldingRepository
		extends JpaRepository<PortfolioHolding, Long> {

	Optional<PortfolioHolding> findByEmailAndSymbol(String email, String symbol);

	List<PortfolioHolding> findByEmailOrderBySymbol(String email);

	@Query(value = """
			SELECT
			    pt.symbol AS symbol,
			    pt.company_name AS companyName,

			    SUM(
			        CASE
			            WHEN pt.transaction_type = 'BUY'
			            THEN pt.quantity
			            ELSE -pt.quantity
			        END
			    ) AS quantity,

			    SUM(
			        CASE
			            WHEN pt.transaction_type = 'BUY'
			            THEN pt.quantity * pt.price
			            ELSE 0
			        END
			    ) AS investedAmount

			FROM portfolio_transactions pt

			WHERE pt.email = :email

			GROUP BY pt.symbol, pt.company_name

			HAVING SUM(
			    CASE
			        WHEN pt.transaction_type = 'BUY'
			        THEN pt.quantity
			        ELSE -pt.quantity
			    END
			) > 0

			ORDER BY pt.symbol
			""", nativeQuery = true)
	List<PortfolioHoldingProjection> getHoldings(
			@Param("email") String email);

	@Query(value = """
				SELECT

			COUNT(DISTINCT symbol) AS totalHoldings,

			COALESCE(SUM(quantity * price),0) AS totalInvested,

			COUNT(CASE WHEN transaction_type='BUY' THEN 1 END) AS buyTransactions,

			COUNT(CASE WHEN transaction_type='SELL' THEN 1 END) AS sellTransactions,

			COALESCE(SUM(
			CASE
			WHEN transaction_date >= CURRENT_DATE - INTERVAL '6 days'
			THEN quantity * price
			END),0) AS weeklyInvestment,

			COALESCE(SUM(
			CASE
			WHEN DATE_TRUNC('month', transaction_date)
			= DATE_TRUNC('month', CURRENT_DATE)
			THEN quantity * price
			END),0) AS monthlyInvestment,

			COALESCE(SUM(
			CASE
			WHEN DATE_TRUNC('year', transaction_date)
			= DATE_TRUNC('year', CURRENT_DATE)
			THEN quantity * price
			END),0) AS yearlyInvestment,

			COALESCE(MAX(quantity * price),0) AS highestInvestment

			FROM portfolio_transactions p

			WHERE p.email = :email;
			""", nativeQuery = true)

	PortfolioDashboardProjection getDashboardMetrics(@Param("email") String email);

}
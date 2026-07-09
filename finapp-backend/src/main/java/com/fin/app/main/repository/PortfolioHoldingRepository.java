package com.fin.app.main.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fin.app.main.entity.PortfolioHolding;
import com.fin.app.main.projection.PortfolioHoldingProjection;

public interface PortfolioHoldingRepository
		extends JpaRepository<PortfolioHolding, Long> {

	Optional<PortfolioHolding> findByEmailAndSymbol(String email, String symbol);

	List<PortfolioHolding> findByEmail(String email);

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
}
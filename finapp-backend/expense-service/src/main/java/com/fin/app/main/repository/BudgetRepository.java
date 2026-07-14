package com.fin.app.main.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fin.app.main.entity.Budget;

public interface BudgetRepository
        extends JpaRepository<Budget, Long> {

    Optional<Budget> findByEmail(String email);
}
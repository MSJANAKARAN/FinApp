package com.fin.app.main.service;

import java.io.IOException;
import java.util.List;

import org.springframework.security.core.Authentication;

import com.fin.app.main.entity.Expense;

public interface ReportService {

    byte[] generateExpensePDF(Authentication authentication,List<Expense> expenses) throws Exception;

    byte[] generateExpenseExcel(Authentication authentication,List<Expense> expenses) throws IOException;

    byte[] generateExpenseCSV(Authentication authentication,List<Expense> expenses) throws Exception;

}

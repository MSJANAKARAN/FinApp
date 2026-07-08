package com.fin.app.main.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.fin.app.main.entity.Expense;
import com.fin.app.main.service.ReportService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class ReportServiceImpl implements ReportService {

        @Override
        public byte[] generateExpenseCSV(Authentication authentication, List<Expense> expenses) throws Exception {
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");

                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm:ss a");

                StringBuilder csv = new StringBuilder();
                csv.append("Expense Report").append("\n");
                csv.append("Email,").append(authentication.getName()).append("\n");
                csv.append("Export Date,").append(LocalDate.now().format(dateFormatter)).append("\n");
                csv.append("Export Time,").append(LocalTime.now().format(timeFormatter)).append("\n");
                csv.append("Total Records,").append(expenses.size()).append("\n\n");

                csv.append("Category,Description,Amount,Expense Date,Payment Type")
                                .append("\n");

                for (Expense expense : expenses) {
                        csv.append(expense.getCategory()).append(",");
                        csv.append(expense.getDescription()).append(",");
                        csv.append(expense.getAmount()).append(",");
                        csv.append(expense.getExpenseDate()).append(",");
                        csv.append(expense.getPaymentType()).append("\n");
                }

                return csv.toString().getBytes(StandardCharsets.UTF_8);
        }

        @Override
        public byte[] generateExpensePDF(Authentication authentication, List<Expense> expenses) throws Exception {

                // Create document
                ByteArrayOutputStream output = new ByteArrayOutputStream();
                Document document = new Document(PageSize.A4);
                PdfWriter.getInstance(document, output);

                document.open();
                // Add title
                Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);

                Paragraph title = new Paragraph("Expense Report", titleFont);

                title.setAlignment(Element.ALIGN_CENTER);

                document.add(title);
                document.add(Chunk.NEWLINE);

                document.add(new Paragraph(
                                "Email: " + authentication.getName()));

                document.add(new Paragraph("Export Date: " +
                                LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy"))));

                document.add(new Paragraph("Export Time: " +
                                LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm:ss a"))));

                document.add(new Paragraph(
                                "Total Records: " +
                                                expenses.size()));

                document.add(Chunk.NEWLINE);

                // Create table
                PdfPTable table = new PdfPTable(5);
                table.setWidthPercentage(100);

                table.setWidths(new float[] {
                                3f,
                                4f,
                                2f,
                                3f,
                                2f
                });

                addHeader(table, "Category");
                addHeader(table, "Description");
                addHeader(table, "Amount");
                addHeader(table, "Expense Date");
                addHeader(table, "Payment Type");

                for (Expense expense : expenses) {

                        table.addCell(expense.getCategory());
                        table.addCell(expense.getDescription());
                        table.addCell(expense.getAmount().toString());
                        table.addCell(expense.getExpenseDate().toString());
                        table.addCell(expense.getPaymentType());
                }

                document.add(table);

                // Close document
                document.close();
                return output.toByteArray();
        }

        @Override
        public byte[] generateExpenseExcel(Authentication authentication, List<Expense> expenses) throws IOException {

                Workbook workbook = new XSSFWorkbook();
                Sheet sheet = workbook.createSheet("Expenses");

                int rowNum = 0;

                // Report Title
                Row titleRow = sheet.createRow(rowNum++);
                titleRow.createCell(0).setCellValue("Expense Report");

                Row emailRow = sheet.createRow(rowNum++);
                emailRow.createCell(0).setCellValue("Email");
                emailRow.createCell(1).setCellValue(authentication.getName());

                Row dateRow = sheet.createRow(rowNum++);
                dateRow.createCell(0).setCellValue("Export Date");
                dateRow.createCell(1).setCellValue(LocalDate.now().toString());

                Row timeRow = sheet.createRow(rowNum++);
                timeRow.createCell(0).setCellValue("Export Time");
                timeRow.createCell(1).setCellValue(
                                LocalTime.now().format(
                                                DateTimeFormatter.ofPattern("hh:mm:ss a")));

                Row totalRow = sheet.createRow(rowNum++);
                totalRow.createCell(0).setCellValue("Total Records");
                totalRow.createCell(1).setCellValue(expenses.size());

                rowNum++;

                // Header
                Row header = sheet.createRow(rowNum++);

                header.createCell(0).setCellValue("Category");
                header.createCell(1).setCellValue("Description");
                header.createCell(2).setCellValue("Amount");
                header.createCell(3).setCellValue("Expense Date");
                header.createCell(4).setCellValue("Payment Type");

                // Data
                for (Expense expense : expenses) {

                        Row row = sheet.createRow(rowNum++);

                        row.createCell(0).setCellValue(expense.getCategory());
                        row.createCell(1).setCellValue(expense.getDescription());
                        row.createCell(2).setCellValue(
                                        expense.getAmount().doubleValue());
                        row.createCell(3).setCellValue(
                                        expense.getExpenseDate().toString());
                        row.createCell(4).setCellValue(
                                        expense.getPaymentType());
                }

                // Auto-size columns
                for (int i = 0; i < 5; i++) {
                        sheet.autoSizeColumn(i);
                }

                ByteArrayOutputStream output = new ByteArrayOutputStream();

                workbook.write(output);
                workbook.close();

                return output.toByteArray();
        }

        private void addHeader(PdfPTable table, String text) {

                Font font = FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD);

                PdfPCell cell = new PdfPCell(new Phrase(text, font));

                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(8);

                table.addCell(cell);
        }
}

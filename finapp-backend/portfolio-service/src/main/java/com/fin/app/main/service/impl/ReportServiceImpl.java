package com.fin.app.main.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.fin.app.main.dto.portfolio.HoldingDto;
import com.fin.app.main.entity.PortfolioTransaction;
import com.fin.app.main.service.ReportService;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class ReportServiceImpl implements ReportService {

        NumberFormat formatter = NumberFormat.getCurrencyInstance(
                        new Locale("en", "IN"));


        @Override
        public byte[] generatePortfolioCSV(Authentication authentication, List<PortfolioTransaction> transactions,
                        List<HoldingDto> holdings) throws Exception {
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm:ss a");

                StringBuilder csv = new StringBuilder();
                csv.append("Email,").append(authentication.getName()).append("\n");
                csv.append("Export Date,").append(LocalDate.now().format(dateFormatter)).append("\n");
                csv.append("Export Time,").append(LocalTime.now().format(timeFormatter)).append("\n\n");
                csv.append("Portfolio Holdings Report").append("\n");
                csv.append("Symbol,Company Name,Quantity,Invested Amount,Average Price").append("\n");

                for (HoldingDto holding : holdings) {
                        csv.append(holding.getSymbol()).append(",");
                        csv.append(holding.getCompanyName()).append(",");
                        csv.append(holding.getQuantity()).append(",");
                        csv.append(holding.getInvestedAmount()).append(",");
                        csv.append(holding.getAveragePrice()).append("\n");
                }

                csv.append("\n").append("Portfolio Transactions Report").append("\n");
                csv.append("Symbol,Company Name,Asset Type,Transaction Type,Quantity,Price,Transaction Date")
                                .append("\n");

                for (PortfolioTransaction transaction : transactions) {
                        csv.append(transaction.getSymbol()).append(",");
                        csv.append(transaction.getCompanyName()).append(",");
                        csv.append(transaction.getAssetType()).append(",");
                        csv.append(transaction.getTransactionType()).append(",");
                        csv.append(transaction.getQuantity()).append(",");
                        csv.append(transaction.getPrice()).append(",");
                        csv.append(transaction.getTransactionDate()).append("\n");
                }
                return csv.toString().getBytes(StandardCharsets.UTF_8);
        }

        @Override
        public byte[] generatePortfolioPDF(Authentication authentication, List<PortfolioTransaction> transactions,
                        List<HoldingDto> holdings) throws Exception {

                // Create document
                ByteArrayOutputStream output = new ByteArrayOutputStream();
                Document document = new Document(PageSize.A4);
                PdfWriter.getInstance(document, output);

                document.open();
                // Add title
                Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
                Font fontHeader = FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD, 10);

                Font fontCell = FontFactory.getFont(
                                FontFactory.HELVETICA, 9);
                document.add(new Paragraph("Email: " + authentication.getName(), fontHeader));

                document.add(new Paragraph("Export Date: " +
                                LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), fontHeader));

                document.add(new Paragraph("Export Time: " +
                                LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm:ss a")), fontHeader));

                document.add(Chunk.NEWLINE);

                Paragraph title = new Paragraph("Portfolio Holdings Report", titleFont);
                title.setAlignment(Element.ALIGN_CENTER);
                document.add(title);
                document.add(Chunk.NEWLINE);

                // Create table
                PdfPTable table = new PdfPTable(5);
                table.setWidthPercentage(100);

                table.setWidths(new float[] {
                                2f,
                                4f,
                                3f,
                                3f,
                                3f
                });

                addHeader(table, "Symbol", fontHeader);
                addHeader(table, "Company Name", fontHeader);
                addHeader(table, "Quantity", fontHeader);
                addHeader(table, "Invested Amount", fontHeader);
                addHeader(table, "Average Price", fontHeader);

                for (HoldingDto holding : holdings) {
                        addCell(table, holding.getSymbol(), fontCell);
                        addCell(table, holding.getCompanyName(), fontCell);
                        addCell(table, holding.getQuantity().toString(), fontCell);
                        addCell(table, holding.getInvestedAmount().toString(), fontCell);
                        addCell(table, holding.getAveragePrice().toString(), fontCell);
                }

                document.add(table);
                document.add(Chunk.NEWLINE);

                Paragraph title1 = new Paragraph("Portfolio Transactions Report", titleFont);

                title1.setAlignment(Element.ALIGN_CENTER);
                document.add(title1);
                document.add(Chunk.NEWLINE);

                // Create table
                PdfPTable table1 = new PdfPTable(7);
                table1.setWidthPercentage(100);

                table1.setWidths(new float[] {
                                2f,
                                4f,
                                3f,
                                2f,
                                2f,
                                3f,
                                3f
                });

                addHeader(table1, "Symbol", fontHeader);
                addHeader(table1, "Company Name", fontHeader);
                addHeader(table1, "Asset Type", fontHeader);
                addHeader(table1, "Transaction Type", fontHeader);
                addHeader(table1, "Quantity", fontHeader);
                addHeader(table1, "Price", fontHeader);
                addHeader(table1, "Transaction Date", fontHeader);

                for (PortfolioTransaction transaction : transactions) {
                        addCell(table1, transaction.getSymbol(), fontCell);
                        addCell(table1, transaction.getCompanyName(), fontCell);
                        addCell(table1, transaction.getAssetType(), fontCell);
                        addCell(table1, transaction.getTransactionType().toString(), fontCell);
                        addCell(table1, transaction.getQuantity().toString(), fontCell);
                        addCell(table1, transaction.getPrice().toString(), fontCell);
                        addCell(table1, transaction.getTransactionDate().toString(), fontCell);
                }

                document.add(table1);

                // Close document
                document.close();
                return output.toByteArray();
        }

        @Override
        public byte[] generatePortfolioExcel(Authentication authentication, List<PortfolioTransaction> transactions,
                        List<HoldingDto> holdings) throws IOException {

                Workbook workbook = new XSSFWorkbook();
                Sheet sheet = workbook.createSheet("Portfolio");

                int rowNum = 0;

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

                rowNum++;

                // Report Title
                Row titleRow = sheet.createRow(rowNum++);
                titleRow.createCell(0).setCellValue("Portfolio Holdings Report");

                // Header
                Row header = sheet.createRow(rowNum++);

                header.createCell(0).setCellValue("Symbol");
                header.createCell(1).setCellValue("Company Name");
                header.createCell(2).setCellValue("Quantity");
                header.createCell(3).setCellValue("Invested Amount");
                header.createCell(4).setCellValue("Average Price");

                // Data
                for (HoldingDto holding : holdings) {

                        Row row = sheet.createRow(rowNum++);

                        row.createCell(0).setCellValue(holding.getSymbol());
                        row.createCell(1).setCellValue(holding.getCompanyName());
                        row.createCell(2).setCellValue(
                                        holding.getQuantity().doubleValue());
                        row.createCell(3).setCellValue(formatter.format(
                                        holding.getInvestedAmount()));
                        row.createCell(4).setCellValue(formatter.format(
                                        holding.getAveragePrice()));
                }

                // Auto-size columns
                for (int i = 0; i < 5; i++) {
                        sheet.autoSizeColumn(i);
                }
                rowNum++;

                // Report Title
                Row titleRow1 = sheet.createRow(rowNum++);
                titleRow1.createCell(0).setCellValue("Portfolio Transactions Report");

                // Header
                Row header1 = sheet.createRow(rowNum++);

                header1.createCell(0).setCellValue("Symbol");
                header1.createCell(1).setCellValue("Company Name");
                header1.createCell(2).setCellValue("Asset Type");
                header1.createCell(3).setCellValue("Transacion Type");
                header1.createCell(4).setCellValue("Quantity");
                header1.createCell(5).setCellValue("Price");
                header1.createCell(6).setCellValue("Transacion Date");
                // Data
                for (PortfolioTransaction transaction : transactions) {

                        Row row = sheet.createRow(rowNum++);

                        row.createCell(0).setCellValue(transaction.getSymbol());
                        row.createCell(1).setCellValue(transaction.getCompanyName());
                        row.createCell(2).setCellValue(transaction.getAssetType());
                        row.createCell(3).setCellValue(transaction.getTransactionType().toString());
                        row.createCell(4).setCellValue(
                                        transaction.getQuantity().doubleValue());
                        row.createCell(5).setCellValue(formatter.format(transaction.getPrice()));
                        row.createCell(6).setCellValue(
                                        transaction.getTransactionDate().toString());
                }

                // Auto-size columns
                for (int i = 0; i < 7; i++) {
                        sheet.autoSizeColumn(i);
                }
                ByteArrayOutputStream output = new ByteArrayOutputStream();

                workbook.write(output);
                workbook.close();

                return output.toByteArray();
        }

        private void addHeader(PdfPTable table, String text, Font font) {
                PdfPCell cell = new PdfPCell(new Phrase(text, font));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(8);
                table.addCell(cell);
        }

        private void addCell(PdfPTable table, String value, Font font) {
                PdfPCell cell = new PdfPCell(new Phrase(value, font));
                cell.setPadding(6);
                cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(cell);
        }
}

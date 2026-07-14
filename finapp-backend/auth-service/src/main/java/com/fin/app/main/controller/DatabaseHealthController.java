package com.fin.app.main.controller;

import java.sql.Connection;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DatabaseHealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/api/db-health")
    public ResponseEntity<String> dbHealth() {

        try (Connection connection = dataSource.getConnection()) {

            return ResponseEntity.ok(
                    "Database Connected Successfully");

        } catch (Exception exception) {

            return ResponseEntity.internalServerError()
                    .body(exception.getMessage());
        }
    }
}
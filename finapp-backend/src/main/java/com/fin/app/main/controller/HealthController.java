package com.fin.app.main.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> health() {

        Map<String, Object> response = new HashMap<>();

        response.put("application", "FinApp");
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }
}
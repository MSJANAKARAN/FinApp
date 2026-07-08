package com.fin.app.main.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fin.app.main.dto.auth.LoginRequestDto;
import com.fin.app.main.dto.auth.LoginResponseDto;
import com.fin.app.main.dto.auth.RegisterRequestDto;
import com.fin.app.main.dto.common.ApiResponseDto;
import com.fin.app.main.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService) {

        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDto> registerUser(
            @Valid
            @RequestBody RegisterRequestDto requestDto) {

        return ResponseEntity.ok(
                authService.registerUser(
                        requestDto));
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> loginUser(
            @RequestBody LoginRequestDto requestDto) {
        return ResponseEntity.ok(
                authService.loginUser(requestDto));
    }
}

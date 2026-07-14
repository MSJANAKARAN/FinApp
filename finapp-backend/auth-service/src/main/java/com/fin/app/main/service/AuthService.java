package com.fin.app.main.service;

import com.fin.app.main.dto.auth.LoginRequestDto;
import com.fin.app.main.dto.auth.LoginResponseDto;
import com.fin.app.main.dto.auth.RegisterRequestDto;
import com.fin.app.main.dto.common.ApiResponseDto;

public interface AuthService {

    ApiResponseDto registerUser(
            RegisterRequestDto requestDto);
    
    LoginResponseDto loginUser(
            LoginRequestDto requestDto);
}

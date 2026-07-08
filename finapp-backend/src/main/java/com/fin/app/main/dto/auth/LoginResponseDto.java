package com.fin.app.main.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class LoginResponseDto {

 
	private boolean success;
    private String message;
    private String token;

}
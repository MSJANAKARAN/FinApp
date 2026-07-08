package com.fin.app.main.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequestDto {

    @NotBlank
    private String fullName;

    @Email
    private String email;

   @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,12}$",
        message = "Password must contain uppercase, lowercase, number and special character"
    )
    private String password;
}
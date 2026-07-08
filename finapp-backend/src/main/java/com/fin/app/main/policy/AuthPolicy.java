package com.fin.app.main.policy;

import com.fin.app.main.dto.auth.LoginRequestDto;
import com.fin.app.main.exception.BadRequestException;
import org.springframework.util.StringUtils;

public class AuthPolicy {

    public AuthPolicy(LoginRequestDto requestDto) {
    }

    public void validate(LoginRequestDto requestDto) {

        if (!StringUtils.hasText(requestDto.getEmail())) {
            throw new BadRequestException("Entered Email is Empty");

        } else if (!StringUtils.hasText(requestDto.getPassword())) {
            throw new BadRequestException("Entered Password is Empty");

        }

    }

}

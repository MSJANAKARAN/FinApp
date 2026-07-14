package com.fin.app.main.service.impl;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fin.app.main.dto.auth.LoginRequestDto;
import com.fin.app.main.dto.auth.LoginResponseDto;
import com.fin.app.main.dto.auth.RegisterRequestDto;
import com.fin.app.main.dto.common.ApiResponseDto;
import com.fin.app.main.entity.User;
import com.fin.app.main.exception.BadRequestException;
import com.fin.app.main.exception.ConflictException;
import com.fin.app.main.exception.UnauthorizedException;
import com.fin.app.main.policy.AuthPolicy;
import com.fin.app.main.repository.UserRepository;
import com.fin.app.main.security.JwtTokenProvider;
import com.fin.app.main.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;

	public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
			JwtTokenProvider jwtTokenProvider) {

		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtTokenProvider = jwtTokenProvider;
	}

	@Override
	public ApiResponseDto registerUser(RegisterRequestDto requestDto) {

		if (userRepository.existsByEmail(requestDto.getEmail())) {

			throw new ConflictException("Email already exists");
		}

		User user = new User();

		user.setFullName(requestDto.getFullName());

		user.setEmail(requestDto.getEmail());

		user.setPassword(passwordEncoder.encode(requestDto.getPassword()));

		user.setRole("USER");

		user.setCreatedDate(LocalDateTime.now());

		userRepository.save(user);

		return new ApiResponseDto(true, "User registered successfully");
	}

	@Override
	public LoginResponseDto loginUser(LoginRequestDto requestDto) {

		AuthPolicy auth = new AuthPolicy(requestDto);
		auth.validate(requestDto);

		Optional<User> optionalUser = userRepository.findByEmail(requestDto.getEmail());

		if (optionalUser.isEmpty()) {
			throw new UnauthorizedException("Invalid Email or Password");
		}

		User user = optionalUser.get();
		boolean passwordMatched = passwordEncoder.matches(requestDto.getPassword(), user.getPassword());

		if (!passwordMatched) {
			throw new UnauthorizedException("Invalid Email or Password");
		}

		String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail());
		return new LoginResponseDto(true, "Login Successful", token);
	}

}

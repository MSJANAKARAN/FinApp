package com.fin.app.main.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.expiration}")
	private long expiration;

	public String generateToken(Long userId, String email) {

		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

		Date now = new Date();

		Date expiry = new Date(now.getTime() + expiration);

		return Jwts.builder().claim("userId", userId).subject(email).issuedAt(now).expiration(expiry).signWith(key)
				.compact();
	}

	public String getEmailFromToken(String token) {

		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

		return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
	}

	public Long getUserIdFromToken(
			String token) {

		SecretKey key = Keys.hmacShaKeyFor(
				secret.getBytes(
						StandardCharsets.UTF_8));

		Object value = Jwts.parser()
				.verifyWith(key)
				.build()
				.parseSignedClaims(token)
				.getPayload()
				.get("userId");

		return Long.valueOf(
				value.toString());
	}

	public boolean validateToken(String token) {

		try {

			SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

			Jwts.parser().verifyWith(key).build().parseSignedClaims(token);

			return true;

		} catch (Exception e) {

			return false;
		}
	}
}
package com.fin.app.main.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter
                extends OncePerRequestFilter {

        private final JwtTokenProvider jwtTokenProvider;

        public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {

                this.jwtTokenProvider = jwtTokenProvider;
        }

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain filterChain)
                        throws ServletException, IOException {
                try {
                        String authHeader = request.getHeader("Authorization");

                        if (authHeader != null &&
                                        authHeader.startsWith("Bearer ")) {

                                String token = authHeader.substring(7);

                                if (jwtTokenProvider
                                                .validateToken(token)) {

                                        String email = jwtTokenProvider.getEmailFromToken(token);
                                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                                        email,
                                                        null,
                                                        Collections.emptyList());
                                        authentication.setDetails(
                                                        new WebAuthenticationDetailsSource()
                                                                        .buildDetails(request));

                                        SecurityContextHolder
                                                        .getContext()
                                                        .setAuthentication(authentication);
                                }
                        }

                        filterChain.doFilter(
                                        request,
                                        response);
                } catch (ExpiredJwtException ex) {

                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");

                        response.getWriter().write("""
                                            {"message":"JWT token has expired"}
                                        """);

                        return;
                } catch (JwtException ex) {

                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");

                        response.getWriter().write("""
                                            {"message":"Invalid JWT token"}
                                        """);

                        return;
                } catch (Exception e) {
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        response.setContentType("application/json");
                        response.getWriter().write("""
                                            {"message":"Kindly try again after sometime. Internal Server Error!"}
                                        """);
                        return;

                }
        }
}
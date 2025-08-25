package com.ufinet.autos.autos_api.configuration;

import com.ufinet.autos.autos_api.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        System.out.println("=== JWT FILTER DEBUG ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Request Method: " + request.getMethod());

        final String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization header: " + authHeader);

        final String jwt;
        final String userEmail;

        if (StringUtils.isEmpty(authHeader) || !StringUtils.startsWith(authHeader, "Bearer ")) {
            System.out.println("No Bearer token found - continuing filter chain");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        System.out.println("JWT token extracted: " + jwt.substring(0, Math.min(jwt.length(), 20)) + "...");

        try {
            userEmail = jwtUtil.extractUserName(jwt);
            System.out.println("Extracted username: " + userEmail);

            if (StringUtils.isNotEmpty(userEmail) && SecurityContextHolder.getContext().getAuthentication() == null) {
                System.out.println("Loading user details for: " + userEmail);

                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                System.out.println("User details loaded: " + userDetails.getUsername());
                System.out.println("User authorities: " + userDetails.getAuthorities());

                if (jwtUtil.isTokenValid(jwt, userDetails)) {
                    System.out.println("Token is VALID - setting authentication");

                    SecurityContext context = SecurityContextHolder.createEmptyContext();
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    context.setAuthentication(authToken);
                    SecurityContextHolder.setContext(context);

                    System.out.println("Authentication set successfully");
                } else {
                    System.out.println("Token is INVALID");
                }
            } else {
                System.out.println("User email empty or already authenticated");
            }
        } catch (Exception e) {
            System.out.println("ERROR in JWT processing: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("Current authentication: " + SecurityContextHolder.getContext().getAuthentication());
        System.out.println("=== END JWT FILTER DEBUG ===");

        filterChain.doFilter(request, response);
    }
}
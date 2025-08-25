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

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Verificar si el header es válido - CORREGIDO
        if (StringUtils.isEmpty(authHeader) || !StringUtils.startsWith(authHeader, "Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extraer el JWT quitando "Bearer "
        jwt = authHeader.substring(7);

        // Obtener email/username del token
        userEmail = jwtUtil.extractUserName(jwt);

        // Si tenemos un usuario y no está autenticado todavía
        if (StringUtils.isNotEmpty(userEmail) && SecurityContextHolder.getContext().getAuthentication() == null) {
            // CORREGIDO: Usar userDetailsService directamente
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            // Validar el token con el usuario
            if (jwtUtil.isTokenValid(jwt, userDetails)) {
                // Crear un contexto vacío
                SecurityContext context = SecurityContextHolder.createEmptyContext();

                // Generar el token de autenticación
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // Asignar detalles adicionales de la request
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Insertar el token en el contexto
                context.setAuthentication(authToken);

                // Establecer el contexto en el SecurityContextHolder
                SecurityContextHolder.setContext(context);
            }
        }

        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}
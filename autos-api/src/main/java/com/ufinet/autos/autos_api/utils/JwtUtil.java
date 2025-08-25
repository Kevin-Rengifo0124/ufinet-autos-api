package com.ufinet.autos.autos_api.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Clase de utilidad para la generación, validación y extracción de información
 * desde tokens JWT (JSON Web Token).
 * <p>
 * Esta clase usa la librería io.jsonwebtoken (jjwt) para:
 * - Generar tokens de acceso y refresh tokens.
 * - Extraer información (claims) de los tokens.
 * - Validar la integridad y expiración de un token.
 * <p>
 * Se anota como {@link Component} para poder ser inyectada en otros beans de Spring.
 */
@Component
public class JwtUtil {

    /**
     * Extrae el nombre de usuario (subject) del token JWT.
     *
     * @param token Token JWT firmado.
     * @return Nombre de usuario contenido en el token.
     */
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Genera un token de acceso JWT para un usuario específico.
     * Este token tiene una validez de 24 horas.
     *
     * @param userDetails Datos del usuario autenticado.
     * @return Token JWT firmado.
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Valida si el token corresponde al usuario y no ha expirado.
     *
     * @param token       Token JWT a validar.
     * @param userDetails Datos del usuario autenticado.
     * @return true si el token es válido, false en caso contrario.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Extrae un claim específico desde el token JWT.
     *
     * @param token           Token JWT firmado.
     * @param claimsResolvers Función que indica qué claim extraer.
     * @param <T>             Tipo del valor esperado (ej: String, Date).
     * @return Valor del claim solicitado.
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
        final Claims claims = extractAllClaims(token);
        return claimsResolvers.apply(claims);
    }

    /**
     * Genera un token JWT con claims personalizados y una validez de 24 horas.
     *
     * @param extraClaims Claims adicionales a incluir en el token.
     * @param userDetails Datos del usuario autenticado.
     * @return Token JWT firmado.
     */
    private String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 horas
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Genera un refresh token con una validez de 7 días.
     * El refresh token se usa para obtener un nuevo token de acceso
     * sin necesidad de volver a autenticarse.
     *
     * @param extraClaims Claims adicionales a incluir en el token.
     * @param userDetails Datos del usuario autenticado.
     * @return Refresh Token firmado.
     */
    public String generateRefreshToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 604800000)) // 7 días
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Verifica si un token JWT ya ha expirado.
     *
     * @param token Token JWT firmado.
     * @return true si el token ya expiró, false en caso contrario.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extrae la fecha de expiración de un token JWT.
     *
     * @param token Token JWT firmado.
     * @return Fecha de expiración del token.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extrae todos los claims del token JWT.
     *
     * @param token Token JWT firmado.
     * @return Objeto {@link Claims} con toda la información del token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Genera la clave secreta utilizada para firmar y validar los tokens JWT.
     * La clave está codificada en Base64.
     *
     * @return Objeto {@link Key} generado a partir de la clave secreta.
     */
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                "413F4428472B4B6250655368566D5970333763763979244226452948404D6351"
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

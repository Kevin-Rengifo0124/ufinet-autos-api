package com.ufinet.autos.autos_api.controller;

import com.ufinet.autos.autos_api.dto.AuthenticationRequest;
import com.ufinet.autos.autos_api.dto.AuthenticationResponse;
import com.ufinet.autos.autos_api.dto.SignupRequest;
import com.ufinet.autos.autos_api.dto.UserDto;
import com.ufinet.autos.autos_api.entity.User; // Cambiar a tu entidad personalizada
import com.ufinet.autos.autos_api.repository.UserRepository;
import com.ufinet.autos.autos_api.services.auth.AuthService;
import com.ufinet.autos.autos_api.services.jwt.UserService;
import com.ufinet.autos.autos_api.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser(@RequestBody SignupRequest signupRequest) {

        if (authService.hasUserWithEmail(signupRequest.getEmail()))
            return new ResponseEntity<>("Ya existe un usuario registrado con este correo electrónico", HttpStatus.NOT_ACCEPTABLE);

        UserDto createUserDto = authService.createUser(signupRequest);

        if (createUserDto == null) return new ResponseEntity<>
                ("Usuario no creado, vuelve a intentarlo", HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(createUserDto, HttpStatus.CREATED);

    }

    @PostMapping("/login")
    public AuthenticationResponse createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws
            BadCredentialsException,
            DisabledException,
            UsernameNotFoundException {

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(),
                    authenticationRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Usuario incorrecto o clave incorrecta.");
        }

        final UserDetails userDetails = userService.userDetailsService().loadUserByUsername(authenticationRequest.getEmail());

        Optional<User> optionalUser = userRepository.findFirstByEmail(authenticationRequest.getEmail());

        final String jwt = jwtUtil.generateToken(userDetails);
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            authenticationResponse.setJwt(jwt);
            authenticationResponse.setUserId(user.getId());
        }

        return authenticationResponse;
    }
}
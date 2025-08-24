package com.ufinet.autos.autos_api.controller;

import com.ufinet.autos.autos_api.dto.SignupRequest;
import com.ufinet.autos.autos_api.dto.UserDto;
import com.ufinet.autos.autos_api.services.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser(@RequestBody SignupRequest signupRequest){

        if (authService.hasUserWithEmail(signupRequest.getEmail()))
            return  new ResponseEntity<>("Ya existe un usuario registrado con este correo electrónico", HttpStatus.NOT_ACCEPTABLE);

        UserDto createUserDto = authService.createUser(signupRequest);

        if (createUserDto ==  null) return new ResponseEntity<>
                ("Usuario no creado, vuelve a intentarlo", HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(createUserDto, HttpStatus.CREATED);

    }
}

package com.ufinet.autos.autos_api.controller;

import com.ufinet.autos.autos_api.dto.CarDto;
import com.ufinet.autos.autos_api.services.user.UserServiceCar;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceCar userServiceCar;

    @PostMapping("/car")
    public ResponseEntity<?> postCar(@ModelAttribute CarDto carDto) throws IOException {
        boolean success = userServiceCar.postCar(carDto);
        if (success){
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } else {
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

}

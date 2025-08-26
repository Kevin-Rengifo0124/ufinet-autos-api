package com.ufinet.autos.autos_api.controller;

import com.ufinet.autos.autos_api.dto.CarDto;
import com.ufinet.autos.autos_api.services.user.UserServiceCar;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceCar userServiceCar;

    @PostMapping("/car")
    public ResponseEntity<?> postCar(@ModelAttribute CarDto carDto) throws IOException {
        System.out.println("=== CONTROLLER REACHED ===");
        System.out.println("CarDto received: " + carDto);
        System.out.println("Authentication context: " + SecurityContextHolder.getContext().getAuthentication());

        try {
            boolean success = userServiceCar.postCar(carDto);
            System.out.println("Service execution result: " + success);

            if (success) {
                System.out.println("Returning CREATED status");
                return ResponseEntity.status(HttpStatus.CREATED).build();
            } else {
                System.out.println("Returning BAD_REQUEST status");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        } catch (Exception e) {
            System.out.println("ERROR in controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/cars")
    public ResponseEntity<?> getAllCars() {
        return ResponseEntity.ok(userServiceCar.getAllCars());
    }

    @DeleteMapping("/car/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id){
        userServiceCar.deleteCar(id);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/car/{id}")
    public ResponseEntity<CarDto> getCarById(@PathVariable Long id){
        CarDto carDto = userServiceCar.getCarById(id);
        return ResponseEntity.ok(carDto);
    }

}

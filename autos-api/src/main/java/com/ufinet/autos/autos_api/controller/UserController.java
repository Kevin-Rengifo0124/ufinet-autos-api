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
        System.out.println("=== CONTROLLER POST CAR ===");
        System.out.println("CarDto recibido: " + carDto);
        System.out.println("Usuario autenticado: " + SecurityContextHolder.getContext().getAuthentication().getName());

        try {
            boolean success = userServiceCar.postCar(carDto);
            System.out.println("Resultado del servicio: " + success);

            if (success) {
                System.out.println("Auto creado exitosamente");
                return ResponseEntity.status(HttpStatus.CREATED).body("Auto registrado exitosamente");
            } else {
                System.out.println("Error al crear auto");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al registrar el auto");
            }
        } catch (Exception e) {
            System.out.println("Excepción en controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor");
        }
    }

    @GetMapping("/cars")
    public ResponseEntity<?> getAllCars() {
        System.out.println("=== CONTROLLER GET ALL CARS ===");
        System.out.println("Usuario autenticado: " + SecurityContextHolder.getContext().getAuthentication().getName());

        try {
            return ResponseEntity.ok(userServiceCar.getAllCars());
        } catch (Exception e) {
            System.out.println("Error al obtener autos: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener los vehículos");
        }
    }

    @DeleteMapping("/car/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable Long id) {
        System.out.println("=== CONTROLLER DELETE CAR ===");
        System.out.println("ID a eliminar: " + id);
        System.out.println("Usuario autenticado: " + SecurityContextHolder.getContext().getAuthentication().getName());

        try {
            userServiceCar.deleteCar(id);
            System.out.println("Auto eliminado exitosamente");
            return ResponseEntity.ok().body("Auto eliminado exitosamente");
        } catch (RuntimeException e) {
            System.out.println("Error de autorización: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado para eliminar este vehículo");
        } catch (Exception e) {
            System.out.println("Error al eliminar auto: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el vehículo");
        }
    }

    @GetMapping("/car/{id}")
    public ResponseEntity<?> getCarById(@PathVariable Long id) {
        System.out.println("=== CONTROLLER GET CAR BY ID ===");
        System.out.println("ID solicitado: " + id);
        System.out.println("Usuario autenticado: " + SecurityContextHolder.getContext().getAuthentication().getName());

        try {
            CarDto carDto = userServiceCar.getCarById(id);
            return ResponseEntity.ok(carDto);
        } catch (RuntimeException e) {
            System.out.println("Error de autorización: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado para ver este vehículo");
        } catch (Exception e) {
            System.out.println("Error al obtener auto: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener el vehículo");
        }
    }

    @PutMapping("/car/{carId}")
    public ResponseEntity<?> updateCar(@PathVariable Long carId, @ModelAttribute CarDto carDto) throws IOException {
        System.out.println("=== CONTROLLER UPDATE CAR ===");
        System.out.println("ID a actualizar: " + carId);
        System.out.println("CarDto: " + carDto);
        System.out.println("Usuario autenticado: " + SecurityContextHolder.getContext().getAuthentication().getName());

        try {
            boolean success = userServiceCar.updateCar(carId, carDto);
            if (success) {
                System.out.println("Auto actualizado exitosamente");
                return ResponseEntity.ok().body("Auto actualizado exitosamente");
            } else {
                System.out.println("Auto no encontrado o no autorizado");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado para actualizar este vehículo");
            }
        } catch (Exception e) {
            System.out.println("Error al actualizar auto: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el vehículo");
        }
    }
}
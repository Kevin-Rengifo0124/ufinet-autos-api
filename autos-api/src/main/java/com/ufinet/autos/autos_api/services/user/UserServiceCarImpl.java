package com.ufinet.autos.autos_api.services.user;

import com.ufinet.autos.autos_api.dto.CarDto;
import com.ufinet.autos.autos_api.entity.Car;
import com.ufinet.autos.autos_api.entity.User;
import com.ufinet.autos.autos_api.repository.CarRepository;
import com.ufinet.autos.autos_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceCarImpl implements UserServiceCar {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    //Metodo helper para obtener el usuario autenticado
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        System.out.println("Usuario autenticado: " + email);

        return userRepository.findFirstByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));
    }

    @Override
    public boolean postCar(CarDto carDto) throws IOException {
        try {
            //Obtener usuario autenticado
            User authenticatedUser = getAuthenticatedUser();

            Car car = new Car();
            car.setName(carDto.getName());
            car.setBrand(carDto.getBrand());
            car.setColor(carDto.getColor());
            car.setPrice(carDto.getPrice());
            car.setDescription(carDto.getDescription());
            car.setType(carDto.getType());
            car.setTransmission(carDto.getTransmission());
            car.setYear(carDto.getYear());
            car.setImage(carDto.getImage().getBytes());

            //Asociar el auto con el usuario autenticado
            car.setUser(authenticatedUser);

            carRepository.save(car);

            System.out.println("Auto guardado para usuario: " + authenticatedUser.getEmail());
            return true;
        } catch (Exception e) {
            System.out.println("Error al guardar auto: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<CarDto> getAllCars() {
        try {
            // Obtener solo los autos del usuario autenticado
            User authenticatedUser = getAuthenticatedUser();

            System.out.println("Obteniendo autos para usuario: " + authenticatedUser.getEmail());

            List<Car> userCars = carRepository.findAllByUser(authenticatedUser);

            System.out.println("Encontrados " + userCars.size() + " autos para el usuario");

            return userCars.stream()
                    .map(Car::getCarDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error al obtener autos: " + e.getMessage());
            e.printStackTrace();
            return List.of(); // Retornar lista vacía en caso de error
        }
    }

    @Override
    public void deleteCar(Long id) {
        try {
            //Verificar que el auto pertenece al usuario autenticado
            User authenticatedUser = getAuthenticatedUser();

            Optional<Car> carOptional = carRepository.findByIdAndUser(id, authenticatedUser);

            if (carOptional.isPresent()) {
                carRepository.deleteById(id);
                System.out.println("Auto eliminado: " + id + " por usuario: " + authenticatedUser.getEmail());
            } else {
                System.out.println("Auto no encontrado o no pertenece al usuario: " + id);
                throw new RuntimeException("Auto no encontrado o no autorizado");
            }
        } catch (Exception e) {
            System.out.println("Error al eliminar auto: " + e.getMessage());
            throw new RuntimeException("Error al eliminar el auto", e);
        }
    }

    @Override
    public CarDto getCarById(Long id) {
        try {
            //Verificar que el auto pertenece al usuario autenticado
            User authenticatedUser = getAuthenticatedUser();

            Optional<Car> carOptional = carRepository.findByIdAndUser(id, authenticatedUser);

            if (carOptional.isPresent()) {
                System.out.println("Auto encontrado: " + id + " para usuario: " + authenticatedUser.getEmail());
                return carOptional.get().getCarDto();
            } else {
                System.out.println("Auto no encontrado o no pertenece al usuario: " + id);
                throw new RuntimeException("Auto no encontrado o no autorizado");
            }
        } catch (Exception e) {
            System.out.println("Error al obtener auto por ID: " + e.getMessage());
            throw new RuntimeException("Error al obtener el auto", e);
        }
    }

    @Override
    public boolean updateCar(Long carId, CarDto carDto) throws IOException {
        try {
            //Verificar que el auto pertenece al usuario autenticado
            User authenticatedUser = getAuthenticatedUser();

            Optional<Car> optionalCar = carRepository.findByIdAndUser(carId, authenticatedUser);

            if (optionalCar.isPresent()) {
                Car existingCar = optionalCar.get();

                if (carDto.getImage() != null)
                    existingCar.setImage(carDto.getImage().getBytes());

                existingCar.setName(carDto.getName());
                existingCar.setPrice(carDto.getPrice());
                existingCar.setColor(carDto.getColor());
                existingCar.setTransmission(carDto.getTransmission());
                existingCar.setType(carDto.getType());
                existingCar.setYear(carDto.getYear());
                existingCar.setDescription(carDto.getDescription());
                existingCar.setBrand(carDto.getBrand());

                carRepository.save(existingCar);

                System.out.println("Auto actualizado: " + carId + " por usuario: " + authenticatedUser.getEmail());
                return true;
            } else {
                System.out.println("Auto no encontrado o no pertenece al usuario: " + carId);
                return false;
            }
        } catch (Exception e) {
            System.out.println("Error al actualizar auto: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
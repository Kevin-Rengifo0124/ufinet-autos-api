package com.ufinet.autos.autos_api.services.user;

import com.ufinet.autos.autos_api.dto.CarDto;
import com.ufinet.autos.autos_api.entity.Car;
import com.ufinet.autos.autos_api.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UserServiceCarImpl implements UserServiceCar {

    private final CarRepository carRepository;

    @Override
    public boolean postCar(CarDto carDto) throws IOException {
        try {
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
            carRepository.save(car);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

package com.ufinet.autos.autos_api.services.user;

import com.ufinet.autos.autos_api.dto.CarDto;
import com.ufinet.autos.autos_api.entity.Car;
import com.ufinet.autos.autos_api.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @Override
    public List<CarDto> getAllCars() {
        return carRepository.findAll()
                .stream()
                .map(Car::getCarDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }

    @Override
    public CarDto getCarById(Long id) {
        Optional<Car> optionalCar = carRepository.findById(id);
        return optionalCar.map(Car::getCarDto).orElse(null);

    }

    @Override
    public boolean updateCar(Long carId, CarDto carDto) throws IOException {
        Optional<Car> optionalCar = carRepository.findById(carId);
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
            return true;
        } else {
            return false;
        }
    }

}

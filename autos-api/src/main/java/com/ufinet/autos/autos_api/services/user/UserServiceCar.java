package com.ufinet.autos.autos_api.services.user;

import com.ufinet.autos.autos_api.dto.CarDto;

import java.io.IOException;
import java.util.List;

public interface UserServiceCar {

    boolean postCar(CarDto carDto) throws IOException;

    List<CarDto> getAllCars();

    void deleteCar(Long id);


}

package com.ufinet.autos.autos_api.services.user;

import com.ufinet.autos.autos_api.dto.CarDto;

import java.io.IOException;

public interface UserServiceCar {

    boolean postCar(CarDto carDto) throws IOException;
}

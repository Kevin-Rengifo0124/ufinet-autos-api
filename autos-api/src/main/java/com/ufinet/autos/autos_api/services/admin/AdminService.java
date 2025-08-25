package com.ufinet.autos.autos_api.services.admin;

import com.ufinet.autos.autos_api.dto.CarDto;

import java.io.IOException;

public interface AdminService {

    boolean postCar(CarDto carDto) throws IOException;
}

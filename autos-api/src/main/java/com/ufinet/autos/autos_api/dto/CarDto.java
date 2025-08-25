package com.ufinet.autos.autos_api.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
public class CarDto {

    private Long id;

    private String brand;

    private String color;

    private String name;

    private String type;

    private String transmission;

    private String description;

    private Long price;

    private String year;

    private MultipartFile image;

    private byte[] returnedImage;

    @Override
    public String toString() {
        return "CarDto{" +
                "id=" + id +
                ", brand='" + brand + '\'' +
                ", color='" + color + '\'' +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", transmission='" + transmission + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", year=" + year +
                ", image=" + (image != null ? image.getOriginalFilename() : "null") +
                '}';
    }
}

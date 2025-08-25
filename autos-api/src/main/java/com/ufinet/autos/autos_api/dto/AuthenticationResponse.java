package com.ufinet.autos.autos_api.dto;

import lombok.Data;

@Data
public class AuthenticationResponse {

    private String jwt;
    private Long userId;
}

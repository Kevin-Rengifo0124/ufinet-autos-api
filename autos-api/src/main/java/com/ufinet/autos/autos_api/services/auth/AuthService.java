package com.ufinet.autos.autos_api.services.auth;

import com.ufinet.autos.autos_api.dto.SignupRequest;
import com.ufinet.autos.autos_api.dto.UserDto;

public interface AuthService {

    UserDto createUser(SignupRequest signupRequest);

    boolean hasUserWithEmail(String email);


}

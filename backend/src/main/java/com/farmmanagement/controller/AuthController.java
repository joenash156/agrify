package com.farmmanagement.controller;

import com.farmmanagement.dto.RegisterDto;
import com.farmmanagement.service.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final RegistrationService service;
    public AuthController(RegistrationService service){this.service=service;}
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public String register(@RequestBody RegisterDto dto){service.register(dto);return "Registration successful. Use your username and password in Swagger Authorize.";}
}

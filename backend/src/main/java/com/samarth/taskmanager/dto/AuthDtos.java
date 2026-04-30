package com.samarth.taskmanager.dto;

import com.samarth.taskmanager.model.Role;
import jakarta.validation.constraints.*;

public class AuthDtos {
    public record SignupRequest(@NotBlank String name, @Email String email, @Size(min = 6) String password, Role role) {}
    public record LoginRequest(@Email String email, @NotBlank String password) {}
    public record AuthResponse(String token, Long id, String name, String email, Role role) {}
}

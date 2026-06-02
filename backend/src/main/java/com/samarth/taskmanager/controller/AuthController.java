package com.samarth.taskmanager.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.samarth.taskmanager.dto.AuthDtos.*;
import com.samarth.taskmanager.dto.GoogleLoginRequest;
import com.samarth.taskmanager.model.*;
import com.samarth.taskmanager.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${GOOGLE_CLIENT_ID}")
    private String googleClientId;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        Role role = request.role() == null ? Role.MEMBER : request.role();

        User user = User.builder()
                .name(request.name())
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .role(role)
                .authToken(UUID.randomUUID().toString())
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(
                new AuthResponse(
                        user.getAuthToken(),
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        if (user.getAuthToken() == null) {
            user.setAuthToken(UUID.randomUUID().toString());
        }

        userRepository.save(user);

        return ResponseEntity.ok(
                new AuthResponse(
                        user.getAuthToken(),
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                )
        );
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.credential());

            if (idToken == null) {
                return ResponseEntity.badRequest().body("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail().toLowerCase();
            String name = (String) payload.get("name");

            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                user = User.builder()
                        .name(name)
                        .email(email)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .role(Role.MEMBER)
                        .authToken(UUID.randomUUID().toString())
                        .build();
            }

            if (user.getAuthToken() == null) {
                user.setAuthToken(UUID.randomUUID().toString());
            }

            userRepository.save(user);

            return ResponseEntity.ok(
                    new AuthResponse(
                            user.getAuthToken(),
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            user.getRole()
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Google login failed");
        }
    }
}
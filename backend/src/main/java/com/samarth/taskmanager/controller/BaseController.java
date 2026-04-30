package com.samarth.taskmanager.controller;

import com.samarth.taskmanager.model.User;
import com.samarth.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;

@RequiredArgsConstructor
public class BaseController {
    protected final UserRepository userRepository;

    protected User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    protected void onlyAdmin(User user) {
        if (!user.getRole().name().equals("ADMIN")) throw new RuntimeException("Only admin can do this action");
    }
}

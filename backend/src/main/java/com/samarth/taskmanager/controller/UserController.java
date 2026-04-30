package com.samarth.taskmanager.controller;

import com.samarth.taskmanager.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController extends BaseController {
    public UserController(UserRepository userRepository) { super(userRepository); }

    @GetMapping
    public List<Map<String, Object>> users() {
        return userRepository.findAll().stream().map(u -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", u.getId()); m.put("name", u.getName()); m.put("email", u.getEmail()); m.put("role", u.getRole());
            return m;
        }).toList();
    }
}

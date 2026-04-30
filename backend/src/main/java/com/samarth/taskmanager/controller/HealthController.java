package com.samarth.taskmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("app", "Team Task Manager API");
        response.put("status", "running");
        response.put("time", LocalDateTime.now().toString());
        return response;
    }
}

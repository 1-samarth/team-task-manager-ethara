package com.samarth.taskmanager.controller;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class ErrorHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> runtime(RuntimeException ex) { return ResponseEntity.badRequest().body(ex.getMessage()); }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> validation(MethodArgumentNotValidException ex) { return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please enter valid details"); }
}

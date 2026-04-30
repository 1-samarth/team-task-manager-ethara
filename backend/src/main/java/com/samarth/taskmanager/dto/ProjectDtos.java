package com.samarth.taskmanager.dto;

import jakarta.validation.constraints.*;

public class ProjectDtos {
    public record ProjectRequest(@NotBlank String title, String description) {}
    public record AddMemberRequest(@NotNull Long userId) {}
}

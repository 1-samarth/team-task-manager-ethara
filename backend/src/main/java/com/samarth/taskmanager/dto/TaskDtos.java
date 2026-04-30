package com.samarth.taskmanager.dto;

import com.samarth.taskmanager.model.TaskStatus;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class TaskDtos {
    public record TaskRequest(@NotBlank String title, String description, @NotNull Long projectId, @NotNull Long assignedToId, LocalDate dueDate) {}
    public record StatusRequest(@NotNull TaskStatus status) {}
}

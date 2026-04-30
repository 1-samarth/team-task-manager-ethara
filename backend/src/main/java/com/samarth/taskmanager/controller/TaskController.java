package com.samarth.taskmanager.controller;

import com.samarth.taskmanager.dto.TaskDtos.*;
import com.samarth.taskmanager.model.*;
import com.samarth.taskmanager.repository.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController extends BaseController {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository memberRepository;

    public TaskController(UserRepository userRepository, TaskRepository taskRepository, ProjectRepository projectRepository, ProjectMemberRepository memberRepository) {
        super(userRepository);
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.memberRepository = memberRepository;
    }

    @PostMapping
    public Task create(@Valid @RequestBody TaskRequest request) {
        User admin = currentUser();
        onlyAdmin(admin);
        Project project = projectRepository.findById(request.projectId()).orElseThrow(() -> new RuntimeException("Project not found"));
        User assigned = userRepository.findById(request.assignedToId()).orElseThrow(() -> new RuntimeException("Assigned user not found"));
        if (!memberRepository.existsByProjectIdAndUserId(project.getId(), assigned.getId())) {
            memberRepository.save(ProjectMember.builder().project(project).user(assigned).build());
        }
        Task task = Task.builder().title(request.title()).description(request.description()).project(project).assignedTo(assigned).createdBy(admin).dueDate(request.dueDate()).status(TaskStatus.TODO).build();
        return taskRepository.save(task);
    }

    @GetMapping
    public List<Task> list() {
        User user = currentUser();
        if (user.getRole() == Role.ADMIN) return taskRepository.findAll();
        return taskRepository.findByAssignedToId(user.getId());
    }

    @PutMapping("/{taskId}/status")
    public Task updateStatus(@PathVariable Long taskId, @Valid @RequestBody StatusRequest request) {
        User user = currentUser();
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        boolean isAdmin = user.getRole() == Role.ADMIN;
        boolean isAssignedUser = task.getAssignedTo().getId().equals(user.getId());
        if (!isAdmin && !isAssignedUser) throw new RuntimeException("You can update only assigned task");
        task.setStatus(request.status());
        return taskRepository.save(task);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        User user = currentUser();
        List<Task> tasks = user.getRole() == Role.ADMIN ? taskRepository.findAll() : taskRepository.findByAssignedToId(user.getId());
        long todo = tasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();
        long progress = tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long done = tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        long overdue = tasks.stream().filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now()) && t.getStatus() != TaskStatus.DONE).count();
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("total", tasks.size()); data.put("todo", todo); data.put("inProgress", progress); data.put("done", done); data.put("overdue", overdue);
        return data;
    }
}

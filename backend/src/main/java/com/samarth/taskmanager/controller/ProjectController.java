package com.samarth.taskmanager.controller;

import com.samarth.taskmanager.dto.ProjectDtos.*;
import com.samarth.taskmanager.model.*;
import com.samarth.taskmanager.repository.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/projects")
public class ProjectController extends BaseController {
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository memberRepository;

    public ProjectController(UserRepository userRepository, ProjectRepository projectRepository, ProjectMemberRepository memberRepository) {
        super(userRepository);
        this.projectRepository = projectRepository;
        this.memberRepository = memberRepository;
    }

    @PostMapping
    public Project create(@Valid @RequestBody ProjectRequest request) {
        User user = currentUser();
        onlyAdmin(user);
        Project project = Project.builder().title(request.title()).description(request.description()).createdBy(user).build();
        Project saved = projectRepository.save(project);
        memberRepository.save(ProjectMember.builder().project(saved).user(user).build());
        return saved;
    }

    @GetMapping
    public List<Project> list() {
        User user = currentUser();
        if (user.getRole() == Role.ADMIN) return projectRepository.findAll();
        return memberRepository.findByUserId(user.getId()).stream().map(ProjectMember::getProject).toList();
    }

    @PostMapping("/{projectId}/members")
    public String addMember(@PathVariable Long projectId, @Valid @RequestBody AddMemberRequest request) {
        User admin = currentUser();
        onlyAdmin(admin);
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
        User member = userRepository.findById(request.userId()).orElseThrow(() -> new RuntimeException("User not found"));
        if (!memberRepository.existsByProjectIdAndUserId(projectId, request.userId())) {
            memberRepository.save(ProjectMember.builder().project(project).user(member).build());
        }
        return "Member added successfully";
    }
}

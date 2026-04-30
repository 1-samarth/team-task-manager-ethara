package com.samarth.taskmanager.repository;

import com.samarth.taskmanager.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> { }

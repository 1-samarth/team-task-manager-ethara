package com.samarth.taskmanager.repository;

import com.samarth.taskmanager.model.Task;
import com.samarth.taskmanager.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Long userId);
    List<Task> findByProjectId(Long projectId);
    long countByStatus(TaskStatus status);
    long countByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);
}

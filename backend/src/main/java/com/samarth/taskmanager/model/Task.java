package com.samarth.taskmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private LocalDate dueDate;
    private LocalDateTime createdAt;

    @ManyToOne(optional = false)
    private Project project;

    @ManyToOne(optional = false)
    private User assignedTo;

    @ManyToOne(optional = false)
    private User createdBy;

    @PrePersist
    public void beforeSave() {
        createdAt = LocalDateTime.now();
        if (status == null) status = TaskStatus.TODO;
    }
}

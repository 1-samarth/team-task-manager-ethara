package com.samarth.taskmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    private User createdBy;

    private LocalDateTime createdAt;

    @PrePersist
    public void setCreatedAt() { this.createdAt = LocalDateTime.now(); }
}

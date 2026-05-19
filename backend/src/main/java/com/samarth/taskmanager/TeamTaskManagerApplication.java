package com.samarth.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.samarth.taskmanager.model")
@EnableJpaRepositories(basePackages = "com.samarth.taskmanager.repository")
public class TeamTaskManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeamTaskManagerApplication.class, args);
    }
}
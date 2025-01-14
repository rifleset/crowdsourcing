package io.crowdfund.crowdfunding.controller;

import io.crowdfund.crowdfunding.model.Project;
import io.crowdfund.crowdfunding.model.User;
import io.crowdfund.crowdfunding.service.ProjectService;
import io.crowdfund.crowdfunding.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private UserService userService;

    @Autowired
    private ProjectService projectService;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.update(id, user);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }

    @GetMapping("/projects")
    public ResponseEntity<?> getAllProjects() {
        return projectService.findAll();
    }

    @PutMapping("/projects/{id}/approve")
    public ResponseEntity<?> approveProject(@PathVariable Long id) {
        return projectService.approve(id);
    }

    @PutMapping("/projects/{id}/reject")
    public ResponseEntity<?> rejectProject(@PathVariable Long id) {
        return projectService.reject(id);
    }
}
package io.crowdfund.crowdfunding.controller;

import io.crowdfund.crowdfunding.model.Project;
import io.crowdfund.crowdfunding.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ResponseEntity<?> createProject(@RequestPart("json") Project project,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return projectService.save(project, file);
    }

    @GetMapping("/created")
    public ResponseEntity<?> getCreatedProjects() {
        return projectService.findCreatedByCurrentUser();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project project) {
        return projectService.update(id, project);
    }

    @GetMapping("/{id}/backers")
    public ResponseEntity<?> getProjectBackers(@PathVariable Long id) {
        return projectService.findBackersByProjectId(id);
    }

    @GetMapping("/{id}/fundings")
    public ResponseEntity<?> getProjectFundings(@PathVariable Long id) {
        return projectService.findFundingsByProjectId(id);
    }

    @GetMapping
    public ResponseEntity<?> getAllProjects() {
        return projectService.findAllApproved();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProject(@PathVariable Long id) {
        return projectService.findById(id);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getApprovedProjectsOfUser(@PathVariable Long userId) {
        return projectService.findCreatedByUser(userId);
    }

    @PostMapping("/{id}/pledge")
    public ResponseEntity<?> pledgeToProject(@PathVariable Long id, @RequestBody PledgeRequest pledgeRequest) {
        return projectService.pledge(id, pledgeRequest.getAmount());
    }

    @GetMapping("/pledged")
    public ResponseEntity<?> getPledgedProjects() {
        return projectService.findPledgedByCurrentUser();
    }

    @PutMapping("/{id}/close-funding")
    public ResponseEntity<?> closeFunding(@PathVariable Long id) {
        return projectService.closeFunding(id);
    }

    @PutMapping("/{id}/open-funding")
    public ResponseEntity<?> openFunding(@PathVariable Long id) {
        return projectService.openFunding(id);
    }

    @PostMapping("/{id}/update")
    public ResponseEntity<?> sendUpdate(@PathVariable Long id, @RequestBody String updateMessage) {
        return projectService.sendUpdate(id, updateMessage);
    }

    @GetMapping("/{id}/creator")
    public ResponseEntity<?> getProjectCreator(@PathVariable Long id) {
        return projectService.findCreatorByProjectId(id);
    }

    public static class PledgeRequest {
        private double amount;

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }
    }
}
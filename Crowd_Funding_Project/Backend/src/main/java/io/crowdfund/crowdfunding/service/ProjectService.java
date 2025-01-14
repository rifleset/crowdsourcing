package io.crowdfund.crowdfunding.service;

import io.crowdfund.crowdfunding.dto.FundingResponse;
import io.crowdfund.crowdfunding.exception.ProjectNotFoundException;
import io.crowdfund.crowdfunding.exception.UnauthorizedActionException;
import io.crowdfund.crowdfunding.model.Funding;
import io.crowdfund.crowdfunding.model.Project;
import io.crowdfund.crowdfunding.model.User;
import io.crowdfund.crowdfunding.repository.FundingRepository;
import io.crowdfund.crowdfunding.repository.ProjectRepository;
import io.crowdfund.crowdfunding.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FundingRepository fundingRepository;

    @Autowired
    private NotificationService notificationService;

    @Value("${upload.path}")
    private String uploadPath;

    public String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "" : filename.substring(dotIndex + 1);
    }

    public ResponseEntity<?> save(Project project, MultipartFile file) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> currentUserOptional = userRepository.findByUsername(username);
        User currentUser = currentUserOptional
                .orElseThrow(() -> new UnauthorizedActionException("User not found with username " + username));
        if (!"CREATOR".equals(currentUser.getAccountType())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only creators can create projects");
        }
        project.setCreator(currentUser);
        project.setStatus("Pending");
        project.setCreationDate(new java.util.Date());
        Project savedProject = projectRepository.save(project);
        if (file != null && !file.isEmpty()) {
            try {
                byte[] bytes = file.getBytes();
                String filename = savedProject.getId() + "."
                        + getFileExtension(file.getOriginalFilename());
                Path path = Paths.get(uploadPath, filename); // Use Paths.get with multiple arguments
                Files.write(path, bytes);
                savedProject.setProjectPicture(filename);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("An error occurred while uploading the profile picture");
            }
            savedProject = projectRepository.save(savedProject);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedProject);
    }

    public ResponseEntity<?> findAll() {
        List<Project> projects = projectRepository.findAll();
        return ResponseEntity.ok(projects);
    }

    public ResponseEntity<?> findById(Long id) {
        Project project = projectRepository.findByIdFetchBackers(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id " + id));
        return ResponseEntity.ok(project);
    }

    public ResponseEntity<?> findCreatedByCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> currentUserOptional = userRepository.findByUsername(username);
        User currentUser = currentUserOptional
                .orElseThrow(() -> new UnauthorizedActionException("User not found with username " + username));
        List<Project> projects = projectRepository.findByCreator(currentUser);
        return ResponseEntity.ok(projects);
    }

    public ResponseEntity<?> findCreatedByUser(Long id) {
        Optional<User> currentUserOptional = userRepository.findById(id);
        User user = currentUserOptional
                .orElseThrow(() -> new UnauthorizedActionException("User not found with id " + id));
        List<Project> projects = projectRepository.findByCreator(user);
        return ResponseEntity.ok(projects);
    }

    public ResponseEntity<?> update(Long id, Project project) {
        Project existingProject = projectRepository.findByIdFetchBackers(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id " + id));
        existingProject.setName(project.getName());
        existingProject.setDescription(project.getDescription());
        existingProject.setFundingGoal(project.getFundingGoal());
        Project updatedProject = projectRepository.save(existingProject);
        return ResponseEntity.ok(updatedProject);
    }

    public ResponseEntity<?> approve(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id " + id));
        project.setStatus("Approved");
        Project approvedProject = projectRepository.save(project);
        notificationService.notifyUsers(project, project.getName() + " has been approved by the administrator");
        return ResponseEntity.ok(approvedProject);
    }

    public ResponseEntity<?> reject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id " + id));
        project.setStatus("Rejected");
        Project rejectedProject = projectRepository.save(project);
        notificationService.notifyUsers(project, project.getName() + " has been rejected by the administrator");
        return ResponseEntity.ok(rejectedProject);
    }

    public ResponseEntity<?> pledge(Long id, double amount) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> currentUserOptional = userRepository.findByUsername(username);
        User backer = currentUserOptional
                .orElseThrow(() -> new UnauthorizedActionException("User not found with username " + username));
        if (!"BACKER".equals(backer.getAccountType())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only backers can pledge funds");
        }
        Project project = projectRepository.findByIdFetchBackers(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id " + id));
        if (!"Approved".equals(project.getStatus()) || "Closed".equals(project.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Project is not open for funding");
        }
        project.setCurrentFunding(project.getCurrentFunding() + amount);
        Funding funding = new Funding();
        funding.setAmount(amount);
        funding.setBacker(backer);
        funding.setProject(project);
        fundingRepository.save(funding);

        // Add backer to the project's backers set if not already present
        boolean isBackerPresent = false;
        System.out.println(
                "Checking if backer is already present in project backers set of size " + project.getBackers().size());
        for (User user : project.getBackers()) {
            System.out.println("Backer: " + user.getUsername());
            if (user.getUsername().equals(backer.getUsername())) {
                isBackerPresent = true;
                break;
            }
        }
        if (!isBackerPresent) {
            System.out.println("Adding backer to project backers set");
            project.getBackers().add(backer);
        }
        String notification = project.getName() + " has received new funding of amount " + amount + " from "
                + backer.getUsername();
        notificationService.notifyUsers(project, notification);

        // Update total collected for the creator
        User creator = project.getCreator();
        creator.setTotalCollected(creator.getTotalCollected() + amount);
        userRepository.save(creator);

        // Update total contributed for the backer
        backer.setTotalContributed(backer.getTotalContributed() + amount);
        userRepository.save(backer);

        checkMilestones(project);
        Project updatedProject = projectRepository.save(project);
        return ResponseEntity.ok(updatedProject);
    }

    public ResponseEntity<?> findAllApproved() {
        List<Project> projects = projectRepository.findByStatus("Approved");
        return ResponseEntity.ok(projects);
    }

    public ResponseEntity<?> findBackersByProjectId(Long id) {
        Project project = projectRepository.findByIdFetchBackers(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id " + id));
        List<User> backers = project.getBackers().stream().collect(Collectors.toList());
        return ResponseEntity.ok(backers);
    }

    public ResponseEntity<?> findFundingsByProjectId(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id " + id));
        List<Funding> fundings = fundingRepository.findByProject(project);
        List<FundingResponse> fundingResponses = fundings.stream()
                .map(funding -> new FundingResponse(funding.getId(), funding.getAmount(),
                        funding.getBacker().getUsername()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(fundingResponses);
    }

    public ResponseEntity<?> findPledgedByCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> currentUserOptional = userRepository.findByUsername(username);
        User currentUser = currentUserOptional
                .orElseThrow(() -> new UnauthorizedActionException("User not found with username " + username));
        List<Project> projects = projectRepository.findByBackersContaining(currentUser);
        return ResponseEntity.ok(projects);
    }

    public ResponseEntity<?> closeFunding(Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> currentUserOptional = userRepository.findByUsername(username);
        User currentUser = currentUserOptional
                .orElseThrow(() -> new UnauthorizedActionException("User not found with username " + username));

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id " + id));

        // Check if request is by the project creator or an admin
        if (!"ADMIN".equals(currentUser.getAccountType())
                && !currentUser.getId().equals(project.getCreator().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to close funding for this project");
        }
        if ("Closed".equals(project.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Funding for the project is already closed");
        } else if (!"Approved".equals(project.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Project is not approved");
        }
        project.setStatus("Closed");
        notificationService.notifyUsers(project, "Funding for the project " + project.getName() + " has been closed.");
        Project updatedProject = projectRepository.save(project);
        return ResponseEntity.ok(updatedProject);
    }

    public ResponseEntity<?> openFunding(Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> currentUserOptional = userRepository.findByUsername(username);
        User currentUser = currentUserOptional
                .orElseThrow(() -> new UnauthorizedActionException("User not found with username " + username));

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id " + id));

        // Check if request is by the project creator or an admin
        if (!"ADMIN".equals(currentUser.getAccountType())
                && !currentUser.getId().equals(project.getCreator().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to close funding for this project");
        }
        if ("Approved".equals(project.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Project is already open for funding");
        } else if (!"Approved".equals(project.getStatus()) && !"Closed".equals(project.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Project is not approved");
        }
        project.setStatus("Approved");
        notificationService.notifyUsers(project,
                "Funding for the project " + project.getName() + " has been reopened.");
        Project updatedProject = projectRepository.save(project);
        return ResponseEntity.ok(updatedProject);
    }

    public ResponseEntity<?> sendUpdate(Long id, String updateMessage) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> currentUserOptional = userRepository.findByUsername(username);
        User currentUser = currentUserOptional
                .orElseThrow(() -> new UnauthorizedActionException("User not found with username " + username));

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id " + id));

        if (!"Approved".equals(project.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Project is not approved");
        }

        // Include the sender’s name in the message
        String notification = "New update for " + project.getName() + " from " + currentUser.getUsername() + ": "
                + updateMessage;
        notificationService.notifyUsers(project, notification);
        Project updatedProject = projectRepository.save(project);
        return ResponseEntity.ok(updatedProject);
    }

    private void checkMilestones(Project project) {
        double percentage = (project.getCurrentFunding() / project.getFundingGoal()) * 100;
        if (percentage >= 25 && !project.getMilestones().contains("25%")) {
            project.getMilestones().add("25%");
            notificationService.notifyUsers(project, project.getName() + " has reached 25% of its funding goal.");
        }
        if (percentage >= 50 && !project.getMilestones().contains("50%")) {
            project.getMilestones().add("50%");
            notificationService.notifyUsers(project, project.getName() + " has reached 50% of its funding goal.");
        }
        if (percentage >= 75 && !project.getMilestones().contains("75%")) {
            project.getMilestones().add("75%");
            notificationService.notifyUsers(project, project.getName() + " has reached 75% of its funding goal.");
        }
        if (percentage >= 100 && !project.getMilestones().contains("100%")) {
            project.getMilestones().add("100%");
            notificationService.notifyUsers(project, project.getName() + " has reached 100% of its funding goal.");
        }
    }

    public ResponseEntity<?> findCreatorByProjectId(Long id) {
        Optional<Project> projectOptional = projectRepository.findById(id);
        if (!projectOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found with id " + id);
        }
        Project project = projectOptional.get();
        User creator = project.getCreator();
        return ResponseEntity.ok(creator);
    }
}
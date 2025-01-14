package io.crowdfund.crowdfunding.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.Date;
import java.util.List;

@Entity
@Data
@ToString(exclude = { "creator", "backers", "fundings" })
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String status = "Pending"; // Possible values: Pending, Approved, Rejected, Closed
    private double fundingGoal;
    private double currentFunding;
    private String projectPicture;
    private Date creationDate;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    @JsonBackReference(value = "createdProjects")
    private User creator;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "project_backers", joinColumns = @JoinColumn(name = "project_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> backers;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "projectFundings")
    private List<Funding> fundings;

    @ElementCollection
    private List<String> milestones;

    @ElementCollection
    private List<String> notifications;
}
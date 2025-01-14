package io.crowdfund.crowdfunding.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@ToString(exclude = { "backer", "project" })
public class Funding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double amount;

    @ManyToOne
    @JoinColumn(name = "backer_id")
    @JsonBackReference(value = "userFundings")
    private User backer;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference(value = "projectFundings")
    private Project project;
}
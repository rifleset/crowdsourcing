package io.crowdfund.crowdfunding.repository;

import io.crowdfund.crowdfunding.model.Project;
import io.crowdfund.crowdfunding.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCreator(User creator);

    List<Project> findByStatus(String status);

    List<Project> findByBackersContaining(User backer);


    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.backers WHERE p.id = :id")
    Optional<Project> findByIdFetchBackers(@Param("id") Long id);


}
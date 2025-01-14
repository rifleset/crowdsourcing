package io.crowdfund.crowdfunding.repository;

import io.crowdfund.crowdfunding.model.Funding;
import io.crowdfund.crowdfunding.model.Project;
import io.crowdfund.crowdfunding.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FundingRepository extends JpaRepository<Funding, Long> {
    List<Funding> findByBacker(User backer);
    List<Funding> findByProject(Project project);
}
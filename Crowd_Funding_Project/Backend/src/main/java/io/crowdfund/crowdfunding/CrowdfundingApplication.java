package io.crowdfund.crowdfunding;

import io.crowdfund.crowdfunding.model.Role;
import io.crowdfund.crowdfunding.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "io.crowdfund.crowdfunding.repository")
@EntityScan(basePackages = "io.crowdfund.crowdfunding.model")
public class CrowdfundingApplication {

    @Autowired
    private RoleRepository roleRepository;

    public static void main(String[] args) {
        SpringApplication.run(CrowdfundingApplication.class, args);
    }

    @Bean
    public CommandLineRunner initRoles() {
        return args -> {
            if (roleRepository.findByName("ROLE_ADMIN") == null) {
                roleRepository.save(new Role("ROLE_ADMIN"));
            }
            if (roleRepository.findByName("ROLE_CREATOR") == null) {
                roleRepository.save(new Role("ROLE_CREATOR"));
            }
            if (roleRepository.findByName("ROLE_BACKER") == null) {
                roleRepository.save(new Role("ROLE_BACKER"));
            }
        };
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOriginPatterns("http://localhost:*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
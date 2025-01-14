package io.crowdfund.crowdfunding.controller;

import io.crowdfund.crowdfunding.jwt.JwtTokenProvider;
import io.crowdfund.crowdfunding.model.Role;
import io.crowdfund.crowdfunding.model.User;
import io.crowdfund.crowdfunding.repository.RoleRepository;
import io.crowdfund.crowdfunding.repository.UserRepository;
import io.crowdfund.crowdfunding.service.UserService;

import org.apache.tomcat.util.http.parser.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Value("${upload.path}")
    private String uploadPath;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestPart("json") User user,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        // Check if user exists
        User existingUser = userRepository.findByUsername(user.getUsername()).orElse(null);
        if (existingUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }
        // Assign roles to the user based on the account type
        List<Role> roles = new ArrayList<>();
        if ("ADMIN".equals(user.getAccountType())) {
            roles.add(roleRepository.findByName("ROLE_ADMIN"));
        } else if ("CREATOR".equals(user.getAccountType())) {
            roles.add(roleRepository.findByName("ROLE_CREATOR"));
        } else if ("BACKER".equals(user.getAccountType())) {
            roles.add(roleRepository.findByName("ROLE_BACKER"));
        }
        user.setRoles(roles);

        // Encode the password using BCrypt
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        if (file != null && !file.isEmpty()) {
            try {
                byte[] bytes = file.getBytes();
                String filename = savedUser.getAccountType() + savedUser.getId() + "."
                        + userService.getFileExtension(file.getOriginalFilename());
                Path path = Paths.get(uploadPath, filename); // Use Paths.get with multiple arguments
                Files.write(path, bytes);
                savedUser.setProfilePicture(filename);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("An error occurred while uploading the profile picture");
            }
            // Update the member's profile picture
            savedUser = userRepository.save(savedUser);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = tokenProvider.generateToken(authentication);
            return ResponseEntity.ok(token);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during login");
        }
    }
}
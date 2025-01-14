package io.crowdfund.crowdfunding.service;

import io.crowdfund.crowdfunding.model.Project;
import io.crowdfund.crowdfunding.model.User;
import io.crowdfund.crowdfunding.repository.ProjectRepository;
import io.crowdfund.crowdfunding.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Service
public class NotificationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public void notifyUsers(Project project, String message) {
        // Add the notification to the project's notifications
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        String formattedDate = formatter.format(date);
        message = formattedDate + "; " + message;

        project.getNotifications().add(message);
        projectRepository.save(project);
        // Notify the creator

        sendNotification(project.getCreator(), message);

        // Notify all backers
        List<User> backers = project.getBackers();
        for (User backer : backers) {
            sendNotification(backer, message);
        }
    }

    void sendNotification(User user, String message) {
        // Add the notification to the user's inbox
        user.getInbox().add(message);
        userRepository.save(user);
        System.out.println("Notification sent to " + user.getUsername() + ": " + message);
    }
}
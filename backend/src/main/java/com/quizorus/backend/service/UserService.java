package com.quizorus.backend.service;

import com.quizorus.backend.controller.dto.UserIdentityAvailability;
import com.quizorus.backend.controller.dto.UserProfile;
import com.quizorus.backend.controller.dto.UserResponse;
import com.quizorus.backend.exception.ResourceNotFoundException;
import com.quizorus.backend.model.Topic;
import com.quizorus.backend.model.User;
import com.quizorus.backend.repository.TopicRepository;
import com.quizorus.backend.repository.UserRepository;
import com.quizorus.backend.security.UserPrincipal;
import org.springframework.core.convert.support.ConfigurableConversionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private UserRepository userRepository;
    private TopicRepository topicRepository;
    private ConfigurableConversionService quizorusConversionService;

    public UserService(UserRepository userRepository, TopicRepository topicRepository, ConfigurableConversionService quizorusConversionService) {
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.quizorusConversionService = quizorusConversionService;
    }

    public UserResponse getCurrentUser(UserPrincipal currentUser){
        return quizorusConversionService.convert(currentUser, UserResponse.class);
    }

    public UserIdentityAvailability checkUsernameAvailability(String email){
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    public UserProfile getUserProfileByUsername(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Long createdTopicCount = topicRepository.countByCreatedBy(user.getId());
        List<Topic> enrolledTopicList = topicRepository.findTopicEntitiesByEnrolledUserListContains(user);
        Long enrolledTopicCount = (long) enrolledTopicList.size();
        return new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), createdTopicCount, enrolledTopicCount);
    }

}

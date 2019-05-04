package com.quizorus.backend.controller;

import com.quizorus.backend.model.ChoiceEntity;
import com.quizorus.backend.payload.ApiResponse;
import com.quizorus.backend.security.CurrentUser;
import com.quizorus.backend.security.UserPrincipal;
import com.quizorus.backend.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("api/questions")
public class QuestionController {

    private QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    //private static final Logger logger = LoggerFactory.getLogger(QuestionController.class);

    @PostMapping("/{questionId}/choices")
    @PreAuthorize("hasRole('USER')")
    @Transactional
    public ResponseEntity<ApiResponse> createChoiceByQuestionId(@CurrentUser UserPrincipal currentUser, @PathVariable Long questionId, @Valid @RequestBody ChoiceEntity choiceRequest){
        return questionService.createChoiceByQuestionId(currentUser, questionId, choiceRequest);
    }

    @DeleteMapping("/{questionId}")
    @PreAuthorize("hasRole('USER')")
    @Transactional
    public ResponseEntity<ApiResponse> deleteQuestionById(@CurrentUser UserPrincipal currentUser, @PathVariable Long questionId){
        return questionService.deleteQuestionById(questionId, currentUser);
    }
}

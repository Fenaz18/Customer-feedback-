package feedback.example.demo.controller;


import feedback.example.demo.model.Feedback;
import feedback.example.demo.service.FeedbackService;
import feedback.example.demo.exception.ResourceNotFoundException; // Import your custom exception
import jakarta.validation.Valid; // For @Valid annotation
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // For method-level security
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController // Marks this class as a REST Controller, handling HTTP requests
@RequestMapping("/api/feedback") // Base path for all endpoints in this controller
@CrossOrigin(origins = "http://localhost:3002") // Allows requests from your frontend (e.g., React app)
// Adjust the origin to match your frontend's actual URL

public class FeedbackController {

    private final FeedbackService feedbackService;

    // Dependency Injection: Spring will inject an instance of FeedbackService
    @Autowired
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }


    @PostMapping // Maps POST requests to /api/feedback
    public ResponseEntity<Feedback> submitFeedback(@Valid @RequestBody Feedback feedback) {
        // @Valid triggers validation annotations defined in the Feedback model
        // @RequestBody maps the JSON request body to a Feedback object
        Feedback savedFeedback = feedbackService.submitFeedback(feedback);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED); // 201 Created
    }

    @GetMapping // Maps GET requests to /api/feedback
    @PreAuthorize("hasRole('ADMIN')") // Spring Security: Only users with ADMIN role can access
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        List<Feedback> feedbackList = feedbackService.getAllFeedback();
        return new ResponseEntity<>(feedbackList, HttpStatus.OK); // 200 OK
    }

    @GetMapping("/{id}") // Maps GET requests to /api/feedback/{id}
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        // @PathVariable extracts the ID from the URL path
        return feedbackService.getFeedbackById(id)
                .map(feedback -> new ResponseEntity<>(feedback, HttpStatus.OK)) // 200 OK if found
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id " + id)); // 404 Not Found
    }

    @GetMapping("/average-rating") // Maps GET requests to /api/feedback/average-rating
    public ResponseEntity<Double> getAverageRating() {
        Double averageRating = feedbackService.getAverageRating();
        return new ResponseEntity<>(averageRating, HttpStatus.OK); // 200 OK
    }

    @PutMapping("/{id}") // Maps PUT requests to /api/feedback/{id}
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Long id, @Valid @RequestBody Feedback feedback) {
        // @Valid ensures incoming updatedFeedback also adheres to validation rules
        Feedback updated = feedbackService.updateFeedback(id, feedback);
        return new ResponseEntity<>(updated, HttpStatus.OK); // 200 OK
    }

    @DeleteMapping("/{id}") // Maps DELETE requests to /api/feedback/{id}
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
    }

}

package feedback.example.demo.service;

import feedback.example.demo.model.Feedback;
import feedback.example.demo.model.FeedbackStatus;
import feedback.example.demo.repository.FeedbackRepository;
import feedback.example.demo.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // For transaction management

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.DoubleSummaryStatistics; // For calculating average efficiently

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;

    // Dependency Injection: Spring will automatically inject an instance of FeedbackRepository
    @Autowired
    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }


    @Transactional // Ensures the operation is atomic
    public Feedback submitFeedback(Feedback feedback) {
        // Ensure default status is set if not provided (though @Column default handles it)
        if (feedback.getStatus() == null) {
            feedback.setStatus(FeedbackStatus.PENDING);
        }
        // @CreationTimestamp on entity handles submissionDate, no need to set here unless overriding
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    @Transactional
    public Feedback updateFeedback(Long id, Feedback updatedFeedback) {
        return feedbackRepository.findById(id).map(existingFeedback -> {
            // Update fields that are allowed to be changed
            if (updatedFeedback.getCustomerName() != null) {
                existingFeedback.setCustomerName(updatedFeedback.getCustomerName());
            }
            if (updatedFeedback.getEmail() != null) {
                existingFeedback.setEmail(updatedFeedback.getEmail());
            }
            if (updatedFeedback.getRating() != null) {
                existingFeedback.setRating(updatedFeedback.getRating());
            }
            if (updatedFeedback.getComments() != null) {
                existingFeedback.setComments(updatedFeedback.getComments());
            }
            if (updatedFeedback.getStatus() != null) {
                existingFeedback.setStatus(updatedFeedback.getStatus());
            }

            return feedbackRepository.save(existingFeedback);
        }).orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id " + id));
    }

    @Transactional
    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new ResourceNotFoundException("Feedback not found with id " + id);
        }
        feedbackRepository.deleteById(id);
    }

    public Double getAverageRating() {
        List<Feedback> allFeedback = feedbackRepository.findAll();
        if (allFeedback.isEmpty()) {
            return 0.0;
        }

        // Using streams to calculate average rating
        DoubleSummaryStatistics stats = allFeedback.stream()
                .filter(f -> f.getRating() != null) // Only consider feedback with a rating
                .mapToDouble(Feedback::getRating)
                .summaryStatistics();

        return stats.getAverage();
    }

}

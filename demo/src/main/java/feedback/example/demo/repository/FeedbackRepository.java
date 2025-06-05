package feedback.example.demo.repository;

import feedback.example.demo.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository; // Import JpaRepository
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository; // Optional, but good practice
import java.util.List; // For methods returning lists

@Repository

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByEmail(String email);
    List<Feedback> findByRating(Integer rating);
    List<Feedback> findBySubmissionDateAfter(java.time.LocalDateTime submissionDate);
    List<Feedback> findByCustomerNameContainingIgnoreCase(String customerName);

}


 // For methods returning lists


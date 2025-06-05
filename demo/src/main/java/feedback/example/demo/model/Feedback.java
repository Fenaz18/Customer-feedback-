package feedback.example.demo.model;


import jakarta.persistence.*; // Use jakarta.persistence for Spring Boot 3+
import jakarta.validation.constraints.*; // Use jakarta.validation for Spring Boot 3+
import org.hibernate.annotations.CreationTimestamp; // For @CreationTimestamp

import java.time.LocalDateTime;

@Entity // Marks this class as a JPA entity
@Table(name = "feedback") // Specifies the table name in the database
public class Feedback {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configures auto-incrementing ID
    private Long id;

    @Column(name = "customer_name") // Specifies column name in database
    private String customerName;

    @Column(name = "customer_email")
    @Email(message = "Email should be valid") // JSR 303/380 validation for email format
    private String email;

    @Column(name = "rating", nullable = false) // Ensures this column cannot be null in the database
    @NotNull(message = "Rating cannot be null") // JSR 303/380 validation for null check
    @Min(value = 1, message = "Rating must be at least 1") // JSR 303/380 validation for minimum value
    @Max(value = 5, message = "Rating cannot be more than 5") // JSR 303/380 validation for maximum value
    private Integer rating;

    @Column(name = "comments", nullable = false, length = 1000) // Adjust length as needed
    @NotBlank(message = "Comments cannot be empty") // JSR 303/380 validation for non-empty string
    @Size(min = 10, max = 1000, message = "Comments must be between 10 and 1000 characters") // JSR 303/380 validation for string length
    private String comments;

    @Column(name = "submission_date", nullable = false, updatable = false) // updatable=false means it won't be updated after initial creation
    @CreationTimestamp // Automatically sets the creation timestamp when the entity is first persisted
    private LocalDateTime submissionDate;

    @Enumerated(EnumType.STRING) // Stores the enum name (e.g., "PENDING") as a string in the database
    @Column(name = "status")
    private FeedbackStatus status = FeedbackStatus.PENDING; // Default status

    // --- Constructors ---

    // Default constructor (required by JPA)
    public Feedback() {
    }

    // Constructor for creating new feedback (without ID and submissionDate)
    public Feedback(String customerName, String email, Integer rating, String comments) {
        this.customerName = customerName;
        this.email = email;
        this.rating = rating;
        this.comments = comments;
        // status and submissionDate are handled by default/annotations
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    // Note: Typically you don't provide a public setter for @CreationTimestamp,
    // as it's meant to be set automatically. If you need to set it manually
    // for testing or specific scenarios, you can uncomment/add it.
    // public void setSubmissionDate(LocalDateTime submissionDate) {
    //     this.submissionDate = submissionDate;
    // }

    public FeedbackStatus getStatus() {
        return status;
    }

    public void setStatus(FeedbackStatus status) {
        this.status = status;
    }

    // --- toString method (for easy logging/debugging) ---
    @Override
    public String toString() {
        return "Feedback{" +
                "id=" + id +
                ", customerName='" + customerName + '\'' +
                ", email='" + email + '\'' +
                ", rating=" + rating +
                ", comments='" + comments + '\'' +
                ", submissionDate=" + submissionDate +
                ", status=" + status +
                '}';
    }
}
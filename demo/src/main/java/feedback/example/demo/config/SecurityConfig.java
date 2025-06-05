package feedback.example.demo.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; // For @PreAuthorize
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Standard password encoder
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager; // For in-memory user details
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration // Marks this class as a source of bean definitions
@EnableWebSecurity // Enables Spring Security's web security support
@EnableMethodSecurity // Enables method-level security (e.g., @PreAuthorize)

public class SecurityConfig {


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    // Configure CORS: Allow requests from your frontend origin
                    CorsConfiguration corsConfiguration = new CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:3002")); // Adjust to your frontend URL
                    corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(Arrays.asList("*")); // Allow all headers
                    corsConfiguration.setAllowCredentials(true); // Allow sending cookies/auth headers
                    corsConfiguration.setMaxAge(3600L); // How long the pre-flight request can be cached
                    return corsConfiguration;
                }))
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for stateless REST APIs
                // (enable for stateful apps with forms)
                .authorizeHttpRequests(authorize -> authorize
                        // Public endpoints
                        .requestMatchers("/api/feedback").permitAll() // POST /api/feedback (submit feedback)
                        .requestMatchers("/api/feedback/average-rating").permitAll() // GET /api/feedback/average-rating
                        // H2 Console (for development, access is usually limited to admins or specific IP)
                        .requestMatchers("/h2-console/**").permitAll() // Allow access to H2 console (configure later)
                        // Static resources (e.g., HTML, CSS, JS)
                        .requestMatchers("/", "/index.html", "/css/**", "/js/**").permitAll() // Allow serving static files
                        // Protected endpoints (require ADMIN role)
                        .requestMatchers("/api/feedback/**").hasRole("ADMIN") // All other /api/feedback/** paths
                        // Any other request not explicitly permitted will require authentication
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> {}); // Enable HTTP Basic Authentication

        // Needed for H2 console to display frames
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {

        String adminPassword = new BCryptPasswordEncoder().encode("adminpass"); // Replace 'adminpass' with desired pass

        UserDetails adminUser = User.builder()
                .username("admin")
                .password(adminPassword) // Password must be encoded
                .roles("ADMIN") // Assign the ADMIN role
                .build();



        return new InMemoryUserDetailsManager(adminUser); // , regularUser
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}

package com.tinghir.carrentalconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
public class SecurityConfig {
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        logger.debug("Configuring security filter chain");
        
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf
                .csrfTokenRepository(org.springframework.security.web.csrf.CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers("/auth/login", "/auth/register", "/reservations", "/reservations/**", "/payments", "/cars", "/cars/**")
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
                .maximumSessions(1)
                .expiredUrl("/auth/login?expired")
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/csrf").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/cars/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/cars").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/cars/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/cars/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/reservations").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/reservations/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/payments").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/users/me").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/users/me").authenticated()
                .requestMatchers("/users/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );
            
        logger.debug("Security filter chain configured");
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:8081"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization", "Accept", "X-XSRF-TOKEN"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

//    @Bean
//    public CookieSameSiteSupplier applicationCookieSameSiteSupplier() {
//        return CookieSameSiteSupplier.ofNone();
//    }
} 
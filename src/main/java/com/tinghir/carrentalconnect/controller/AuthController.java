package com.tinghir.carrentalconnect.controller;

import com.tinghir.carrentalconnect.dto.UserDTO;
import com.tinghir.carrentalconnect.dto.request.LoginRequest;
import com.tinghir.carrentalconnect.dto.response.AuthResponse;
import com.tinghir.carrentalconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.web.csrf.CsrfToken;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.http.Cookie;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody UserDTO userDTO, HttpServletRequest request) {
        logger.debug("Processing registration request");
        logger.debug("Session ID: {}", request.getSession().getId());
        logger.debug("CSRF Token: {}", request.getAttribute("_csrf"));
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                logger.debug("Cookie: {}={}", cookie.getName(), cookie.getValue());
            }
        }
        return userService.register(userDTO);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        logger.debug("Processing login request");
        logger.debug("Session ID: {}", request.getSession().getId());
        logger.debug("CSRF Token: {}", request.getAttribute("_csrf"));
        return userService.login(loginRequest);
    }

    @GetMapping("/csrf")
    public ResponseEntity<CsrfToken> csrf(HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        logger.debug("CSRF endpoint called - Session ID: {}", session.getId());
        
        CsrfToken token = (CsrfToken) request.getAttribute("_csrf");
        logger.debug("Generated CSRF Token: {}", token.getToken());
        
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                logger.debug("Cookie: {}={}", cookie.getName(), cookie.getValue());
            }
        }
        
        return ResponseEntity.ok(token);
    }
} 
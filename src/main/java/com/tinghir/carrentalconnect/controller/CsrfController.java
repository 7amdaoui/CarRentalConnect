package com.tinghir.carrentalconnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class CsrfController {
    @GetMapping("/csrf")
    public ResponseEntity<CsrfToken> csrf(HttpServletRequest request) {
        CsrfToken token = (CsrfToken) request.getAttribute("_csrf");
        System.out.println("CSRF endpoint: session=" + request.getSession().getId() + ", token=" + (token != null ? token.getToken() : "null"));
        // Print all request headers
        System.out.println("Request Headers:");
        java.util.Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            System.out.println(headerName + ": " + request.getHeader(headerName));
        }
        // Print all cookies
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                System.out.println("Cookie: " + cookie.getName() + "=" + cookie.getValue());
            }
        }
        return ResponseEntity.ok(token);
    }
} 
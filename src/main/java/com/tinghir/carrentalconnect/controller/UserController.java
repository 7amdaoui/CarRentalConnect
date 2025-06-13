package com.tinghir.carrentalconnect.controller;

import com.tinghir.carrentalconnect.dto.UserDTO;
import com.tinghir.carrentalconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private com.tinghir.carrentalconnect.repository.ReservationRepository reservationRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int limit) {
        List<UserDTO> users = userService.getAllUsers(page, limit);
        Map<String, Object> response = new HashMap<>();
        response.put("users", users);
        response.put("total", users.size());
        response.put("page", page);
        response.put("limit", limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null ? authentication.getName() : null;
        if (email == null || email.equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }
        UserDTO user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(@RequestBody UserDTO userDTO) {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null ? authentication.getName() : null;
        if (email == null || email.equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }
        UserDTO existingUser = userService.getUserByEmail(email);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }
        userDTO.setId(existingUser.getId());
        UserDTO updated = userService.updateUser(existingUser.getId(), userDTO);
        return ResponseEntity.ok(updated);
    }
} 
package com.tinghir.carrentalconnect.service.impl;

import com.tinghir.carrentalconnect.config.JwtConfig;
import com.tinghir.carrentalconnect.dto.UserDTO;
import com.tinghir.carrentalconnect.dto.request.LoginRequest;
import com.tinghir.carrentalconnect.dto.response.AuthResponse;
import com.tinghir.carrentalconnect.model.User;
import com.tinghir.carrentalconnect.repository.UserRepository;
import com.tinghir.carrentalconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtConfig jwtConfig;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserDTO::fromEntity)
                .orElse(null);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserDTO::fromEntity)
                .orElse(null);
    }

    @Override
    public List<UserDTO> getAllUsers(int page, int size) {
        // Add pagination if needed
        return userRepository.findAll().stream().map(UserDTO::fromEntity).toList();
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User user = userDTO.toEntity();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return UserDTO.fromEntity(userRepository.save(user));
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (userDTO.getFirstName() != null) user.setFirstName(userDTO.getFirstName());
        if (userDTO.getLastName() != null) user.setLastName(userDTO.getLastName());
        if (userDTO.getPhone() != null) user.setPhone(userDTO.getPhone());
        // Do not update email or password here for security
        return UserDTO.fromEntity(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public AuthResponse register(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User user = userDTO.toEntity();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user = userRepository.save(user);
        // Generate JWT token (same as in login)
        String token = io.jsonwebtoken.Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().toString())
                .claim("userId", user.getId())
                .setIssuedAt(new java.util.Date())
                .setExpiration(new java.util.Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
                .signWith(io.jsonwebtoken.SignatureAlgorithm.HS256, jwtConfig.getSecret())
                .compact();
        return new AuthResponse(UserDTO.fromEntity(user), token);
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        // Generate JWT token
        String token = Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().toString())
                .claim("userId", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
                .signWith(SignatureAlgorithm.HS256, jwtConfig.getSecret())
                .compact();
        return new AuthResponse(UserDTO.fromEntity(user), token);
    }

    @Override
    public UserDTO getCurrentUser() {
        // Implement logic to get current user from security context
        return null;
    }
} 
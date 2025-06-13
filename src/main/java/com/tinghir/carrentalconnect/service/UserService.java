package com.tinghir.carrentalconnect.service;

import com.tinghir.carrentalconnect.dto.UserDTO;
import com.tinghir.carrentalconnect.dto.request.LoginRequest;
import com.tinghir.carrentalconnect.dto.response.AuthResponse;

import java.util.List;

public interface UserService {
    
    UserDTO getUserById(Long id);
    
    UserDTO getUserByEmail(String email);
    
    List<UserDTO> getAllUsers(int page, int size);
    
    UserDTO createUser(UserDTO userDTO);
    
    UserDTO updateUser(Long id, UserDTO userDTO);
    
    void deleteUser(Long id);
    
    AuthResponse register(UserDTO userDTO);
    
    AuthResponse login(LoginRequest loginRequest);
    
    UserDTO getCurrentUser();
} 
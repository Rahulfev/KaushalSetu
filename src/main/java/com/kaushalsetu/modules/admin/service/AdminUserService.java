package com.kaushalsetu.modules.admin.service;

import com.kaushalsetu.entity.Role;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.common.enums.UserStatus;
import com.kaushalsetu.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    // Fetch All with optional Search & Filters
    public List<User> getAllUsers(String search, Integer roleId, UserStatus status) {

        if (search != null && !search.isBlank()) {
            return userRepository.searchUsers(search);
        }

        if (roleId != null && status != null) {
            return userRepository.findByRole_RoleIdAndStatus(roleId, status);
        }

        if (roleId != null) {
            return userRepository.findByRole_RoleId(roleId);
        }

        if (status != null) {
            return userRepository.findByStatus(status);
        }

        return userRepository.findAll();
    }


    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // Change Status (Block/Activate)
    public User updateUserStatus(Integer id, UserStatus newStatus) {

        User user = getUserById(id);
        user.setStatus(newStatus);

        System.out.println("AUDIT: User " + id + " status changed to " + newStatus);

        return userRepository.save(user);
    }

    // Change Role
    public User updateUserRole(Integer id, Role newRole) {

        User user = getUserById(id);
        user.setRole(newRole);

        System.out.println("AUDIT: User " + id + " role changed to " + newRole.getRoleName());

        return userRepository.save(user);
    }
}

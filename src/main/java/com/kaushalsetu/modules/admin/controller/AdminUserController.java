package com.kaushalsetu.modules.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kaushalsetu.common.enums.UserStatus;
import com.kaushalsetu.entity.Role;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.modules.admin.service.AdminUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer roleId,
            @RequestParam(required = false) UserStatus status) {

        return ResponseEntity.ok(
                adminService.getAllUsers(search, roleId, status)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable Integer id,
            @RequestParam UserStatus status) {

        return ResponseEntity.ok(adminService.updateUserStatus(id, status));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Integer id,
            @RequestParam Integer roleId) {

        Role role = new Role();
        role.setRoleId(roleId);
        return ResponseEntity.ok(adminService.updateUserRole(id, role));
    }
}

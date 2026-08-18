package com.kaushalsetu.modules.user.repository;

import com.kaushalsetu.entity.Client;
import com.kaushalsetu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Integer> {
    Optional<Client> findByUser(User user);
}

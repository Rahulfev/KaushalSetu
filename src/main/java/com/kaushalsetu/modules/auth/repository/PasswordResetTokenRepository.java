package com.kaushalsetu.modules.auth.repository;

import com.kaushalsetu.entity.PasswordResetToken;
import com.kaushalsetu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUserAndToken(User user, String token);

    void deleteByUser(User user);
}

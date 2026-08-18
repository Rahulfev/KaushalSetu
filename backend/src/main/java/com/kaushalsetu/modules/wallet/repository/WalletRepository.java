package com.kaushalsetu.modules.wallet.repository;

import com.kaushalsetu.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Integer> {
    Optional<Wallet> findByUser_UserId(Integer userId);
}

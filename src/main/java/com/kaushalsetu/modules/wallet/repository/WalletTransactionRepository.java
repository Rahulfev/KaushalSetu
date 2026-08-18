package com.kaushalsetu.modules.wallet.repository;

import com.kaushalsetu.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Integer> {
    List<WalletTransaction> findByWallet_WalletIdOrderByCreatedAtDesc(Integer walletId);
}

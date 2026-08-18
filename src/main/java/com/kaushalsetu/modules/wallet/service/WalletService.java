package com.kaushalsetu.modules.wallet.service;

import com.kaushalsetu.entity.User;
import com.kaushalsetu.entity.Wallet;
import com.kaushalsetu.entity.WalletTransaction;
import com.kaushalsetu.modules.wallet.dto.WalletResponse;
import com.kaushalsetu.modules.wallet.repository.WalletRepository;
import com.kaushalsetu.modules.wallet.repository.WalletTransactionRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.modules.kyc.repository.KycRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final UserRepository userRepository;
    private final KycRepository kycRepository;

    /** Fetches (or lazily creates) the wallet belonging to a worker. */
    @Transactional
    public Wallet getOrCreateWallet(Integer workerUserId) {
        return walletRepository.findByUser_UserId(workerUserId)
                .orElseGet(() -> {
                    User worker = userRepository.findById(workerUserId)
                            .orElseThrow(() -> new RuntimeException("Worker not found"));
                    Wallet wallet = Wallet.builder()
                            .user(worker)
                            .balance(0.0)
                            .totalEarned(0.0)
                            .totalWithdrawn(0.0)
                            .updatedAt(LocalDateTime.now())
                            .build();
                    return walletRepository.save(wallet);
                });
    }

    /** Credits a worker's wallet — called when an escrow payment is released or a client pays directly. */
    @Transactional
    public void credit(Integer workerUserId, Double amount, Integer contractId, String description) {
        Wallet wallet = getOrCreateWallet(workerUserId);
        wallet.setBalance(wallet.getBalance() + amount);
        wallet.setTotalEarned(wallet.getTotalEarned() + amount);
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        walletTransactionRepository.save(
                WalletTransaction.builder()
                        .wallet(wallet)
                        .type(WalletTransaction.Type.CREDIT)
                        .amount(amount)
                        .contractId(contractId)
                        .description(description)
                        .build()
        );
    }

    /**
     * Withdraw earnings. Only KYC-verified workers with payout details on file (UPI or bank
     * account) can withdraw — this is the "receive wallet credits and withdraw earnings"
     * gate from the KYC requirements. Actual payout-gateway integration (Razorpay Payouts,
     * IMPS, etc.) is a separate concern; this records the debit and leaves a clear audit trail.
     */
    @Transactional
    public void withdraw(Integer workerUserId, Double amount) {
        if (amount == null || amount <= 0) {
            throw new com.kaushalsetu.exception.ApiException("Enter a valid withdrawal amount");
        }

        User worker = userRepository.findById(workerUserId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        if (worker.getKycStatus() != com.kaushalsetu.common.enums.KycStatus.APPROVED) {
            throw new com.kaushalsetu.exception.ApiException(
                    "Complete your KYC verification before withdrawing earnings.");
        }

        var kyc = kycRepository.findTopByUser_UserIdOrderByKycIdDesc(workerUserId)
                .orElseThrow(() -> new com.kaushalsetu.exception.ApiException(
                        "No payout details on file. Complete your KYC to add a UPI ID or bank account."));

        if (kyc.getPayoutMethod() == null) {
            throw new com.kaushalsetu.exception.ApiException(
                    "No payout details on file. Add a UPI ID or bank account in your KYC profile.");
        }

        String destination = kyc.getPayoutMethod() == com.kaushalsetu.common.enums.PayoutMethod.UPI
                ? "UPI (" + kyc.getUpiId() + ")"
                : "bank account ending " + lastFour(kyc.getBankAccountNumber());

        debit(workerUserId, amount, "Withdrawal to " + destination);
    }

    private String lastFour(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) return "****";
        return accountNumber.substring(accountNumber.length() - 4);
    }

    /** Debits a worker's wallet, e.g. for a withdrawal request. */
    @Transactional
    public void debit(Integer workerUserId, Double amount, String description) {
        Wallet wallet = getOrCreateWallet(workerUserId);
        if (wallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient wallet balance");
        }
        wallet.setBalance(wallet.getBalance() - amount);
        wallet.setTotalWithdrawn(wallet.getTotalWithdrawn() + amount);
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        walletTransactionRepository.save(
                WalletTransaction.builder()
                        .wallet(wallet)
                        .type(WalletTransaction.Type.WITHDRAWAL)
                        .amount(amount)
                        .description(description)
                        .build()
        );
    }

    public WalletResponse getWalletForUser(Integer userId) {
        Wallet wallet = getOrCreateWallet(userId);
        List<WalletTransaction> txns =
                walletTransactionRepository.findByWallet_WalletIdOrderByCreatedAtDesc(wallet.getWalletId());

        return WalletResponse.builder()
                .walletId(wallet.getWalletId())
                .balance(wallet.getBalance())
                .totalEarned(wallet.getTotalEarned())
                .totalWithdrawn(wallet.getTotalWithdrawn())
                .transactions(txns.stream().map(t -> WalletResponse.TransactionDto.builder()
                        .transactionId(t.getTransactionId())
                        .type(t.getType().name())
                        .amount(t.getAmount())
                        .contractId(t.getContractId())
                        .description(t.getDescription())
                        .createdAt(t.getCreatedAt())
                        .build()).toList())
                .build();
    }
}

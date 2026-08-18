package com.kaushalsetu.modules.wallet.controller;

import com.kaushalsetu.entity.User;
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.modules.wallet.dto.WalletResponse;
import com.kaushalsetu.modules.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WalletController {

    private final WalletService walletService;
    private final UserRepository userRepository;

    /** The logged-in worker's wallet: balance + full transaction history. */
    @GetMapping("/me")
    @PreAuthorize("hasRole('WORKER')")
    public WalletResponse getMyWallet(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return walletService.getWalletForUser(user.getUserId());
    }

    /**
     * Withdraw earnings out of the wallet. Only KYC-verified workers with payout details
     * on file (UPI or bank account) can withdraw — this is where real payout-gateway
     * integration (Razorpay Payouts, IMPS, etc.) would be plugged in.
     */
    @PostMapping("/withdraw")
    @PreAuthorize("hasRole('WORKER')")
    public java.util.Map<String, Object> withdraw(
            @RequestBody java.util.Map<String, Object> body,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        double amount = Double.parseDouble(body.get("amount").toString());
        walletService.withdraw(user.getUserId(), amount);

        return java.util.Map.of("message", "Withdrawal request submitted", "amount", amount);
    }
}

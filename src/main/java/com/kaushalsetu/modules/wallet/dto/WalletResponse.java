package com.kaushalsetu.modules.wallet.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder
public class WalletResponse {
    private Integer walletId;
    private Double balance;
    private Double totalEarned;
    private Double totalWithdrawn;
    private List<TransactionDto> transactions;

    @Getter @Setter @Builder
    public static class TransactionDto {
        private Integer transactionId;
        private String type;
        private Double amount;
        private Integer contractId;
        private String description;
        private LocalDateTime createdAt;
    }
}

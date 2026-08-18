package com.kaushalsetu.modules.payment.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaushalsetu.common.enums.PaymentStatus;
import com.kaushalsetu.common.enums.TransactionType;
import com.kaushalsetu.entity.EscrowPayment;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.payment.dto.OrganizationEscrowPaymentResponse;
import com.kaushalsetu.modules.payment.service.OrganizationEscrowPaymentService;
import com.kaushalsetu.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/organization/payments")
@RequiredArgsConstructor
public class OrganizationEscrowPaymentController {

    private final OrganizationEscrowPaymentService paymentService;
    private final UserRepository userRepository;

    @GetMapping
    public List<OrganizationEscrowPaymentResponse> getAllPayments(Authentication authentication) {
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ApiException("User not found"));

        return paymentService.getPaymentsForClient(currentUser.getUserId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{escrowId}")
    public OrganizationEscrowPaymentResponse getPaymentById(
            @PathVariable Integer escrowId) {
        return mapToResponse(paymentService.getPaymentById(escrowId));
    }

    @GetMapping("/contract/{contractId}")
    public List<OrganizationEscrowPaymentResponse> getByContract(
            @PathVariable Integer contractId) {
        return paymentService.getPaymentsByContract(contractId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/status/{status}")
    public List<OrganizationEscrowPaymentResponse> getByStatus(
            @PathVariable PaymentStatus status) {
        return paymentService.getPaymentsByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/type/{type}")
    public List<OrganizationEscrowPaymentResponse> getByType(
            @PathVariable TransactionType type) {
        return paymentService.getPaymentsByTransactionType(type)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OrganizationEscrowPaymentResponse mapToResponse(EscrowPayment payment) {
        return new OrganizationEscrowPaymentResponse(
                payment.getEscrowId(),
                payment.getContract().getContractId(),
                payment.getAmount(),
                payment.getPaymentStatus(),
                payment.getTransactionType(),
                payment.getTransactionDate(),
                payment.getContract().getWorker().getUserId(),
                payment.getContract().getWorker().getFullName(),
                payment.getContract().getJob() != null ? payment.getContract().getJob().getTitle() : null
        );
    }

    @PostMapping("/fund/{escrowId}")
    public ResponseEntity<OrganizationEscrowPaymentResponse> fundEscrow(@PathVariable Integer escrowId) {
        EscrowPayment funded = paymentService.fundEscrow(escrowId);
        return ResponseEntity.ok(mapToResponse(funded));
    }


    @PostMapping("/release/{escrowId}")
    public ResponseEntity<OrganizationEscrowPaymentResponse> release(@PathVariable Integer escrowId) {
        EscrowPayment released = paymentService.releaseToWorker(escrowId);
        return ResponseEntity.ok(mapToResponse(released));
    }
}

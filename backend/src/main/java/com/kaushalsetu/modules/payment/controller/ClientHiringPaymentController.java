package com.kaushalsetu.modules.payment.controller;

import com.kaushalsetu.modules.payment.service.ClientHiringPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/client/payments")
@RequiredArgsConstructor
public class ClientHiringPaymentController {

    private final ClientHiringPaymentService paymentService;

    /** CLIENT: create a Razorpay order to pay for a COMPLETED household job. */
    @PostMapping("/create-order")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Map<String, String>> createOrder(@RequestBody Map<String, Object> body) {
        Integer applicationId = Integer.parseInt(body.get("applicationId").toString());
        Double amount = Double.parseDouble(body.get("amount").toString());
        String orderId = paymentService.createOrder(applicationId, amount);
        return ResponseEntity.ok(Map.of("orderId", orderId));
    }

    /** CLIENT: verify payment -> credits worker wallet, marks the job PAID. */
    @PostMapping("/verify")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Map<String, String>> verify(@RequestBody Map<String, String> body) {
        boolean success = paymentService.verifyAndPay(
                body.get("razorpay_order_id"),
                body.get("razorpay_payment_id"),
                body.get("razorpay_signature")
        );
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Payment verified — worker wallet credited"));
        }
        return ResponseEntity.status(400).body(Map.of("message", "Payment verification failed"));
    }

    @GetMapping("/my-history")
    @PreAuthorize("hasAnyRole('CLIENT','WORKER')")
    public ResponseEntity<java.util.List<com.kaushalsetu.modules.payment.dto.ClientPaymentResponse>> myHistory(
            org.springframework.security.core.Authentication auth) {
        return ResponseEntity.ok(paymentService.getMyHistory(auth.getName()));
    }
}

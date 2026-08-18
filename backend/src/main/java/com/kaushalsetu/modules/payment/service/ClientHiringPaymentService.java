package com.kaushalsetu.modules.payment.service;

import com.kaushalsetu.common.enums.ApplicationStatus;
import com.kaushalsetu.entity.ClientPayment;
import com.kaushalsetu.entity.JobApplication;
import com.kaushalsetu.entity.Notification;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.job.repository.JobApplicationRepository;
import com.kaushalsetu.modules.payment.dto.ClientPaymentResponse;
import com.kaushalsetu.modules.payment.repository.ClientPaymentRepository;
import com.kaushalsetu.modules.user.repository.NotificationRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.modules.wallet.service.WalletService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * "Pay Now" — the client's direct Razorpay payment once a household job is COMPLETED.
 * No escrow hold: payment goes straight to the worker's wallet on successful verification.
 */
@Service
@RequiredArgsConstructor
public class ClientHiringPaymentService {

    private final RazorpayClient razorpayClient;
    private final ClientPaymentRepository clientPaymentRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final WalletService walletService;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Transactional
    public String createOrder(Integer applicationId, Double amount) {
        JobApplication app = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApiException("Application not found"));

        if (app.getStatus() != ApplicationStatus.COMPLETED) {
            throw new ApiException("Work must be marked completed by the worker before you can pay");
        }
        if (amount == null || amount <= 0) {
            throw new ApiException("Enter a valid payment amount");
        }

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) Math.round(amount * 100));
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "application_" + applicationId);

            Order order = razorpayClient.orders.create(orderRequest);
            String orderId = order.get("id");

            clientPaymentRepository.save(ClientPayment.builder()
                    .application(app)
                    .amount(amount)
                    .razorpayOrderId(orderId)
                    .status(ClientPayment.Status.PENDING)
                    .build());

            return orderId;
        } catch (Exception e) {
            throw new ApiException("Could not create payment order: " + e.getMessage());
        }
    }

    @Transactional
    public boolean verifyAndPay(String orderId, String paymentId, String signature) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);

            if (!Utils.verifyPaymentSignature(attributes, keySecret)) {
                return false;
            }

            ClientPayment payment = clientPaymentRepository.findByRazorpayOrderId(orderId)
                    .orElseThrow(() -> new ApiException("Order not found: " + orderId));

            payment.setStatus(ClientPayment.Status.PAID);
            payment.setRazorpayPaymentId(paymentId);
            payment.setPaidAt(LocalDateTime.now());
            clientPaymentRepository.save(payment);

            JobApplication app = payment.getApplication();
            app.setStatus(ApplicationStatus.PAID);
            app.setPaidAt(LocalDateTime.now());
            jobApplicationRepository.save(app);

            walletService.credit(
                    app.getWorker().getUserId(),
                    payment.getAmount(),
                    null,
                    "Payment received for \"" + app.getJob().getTitle() + "\""
            );

            notify(app.getWorker().getUserId(), "💰 You've been paid ₹" + payment.getAmount() + " for \"" + app.getJob().getTitle() + "\"! Check your wallet.");
            if (app.getJob().getPostedByUserId() != null) {
                notify(app.getJob().getPostedByUserId(), "Payment successful for \"" + app.getJob().getTitle() + "\". Please rate & review the worker!");
            }

            return true;
        } catch (Exception e) {
            System.err.println("Client payment verification failed: " + e.getMessage());
            return false;
        }
    }

    public java.util.List<ClientPaymentResponse> getMyHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        String role = user.getRole() != null ? user.getRole().getRoleName() : "";
        java.util.List<ClientPayment> payments = "CLIENT".equals(role)
                ? clientPaymentRepository.findByApplication_Job_PostedByUserId(user.getUserId())
                : clientPaymentRepository.findByApplication_Worker_UserId(user.getUserId());

        return payments.stream().map(p -> {
            JobApplication app = p.getApplication();
            Integer clientId = app.getJob().getPostedByUserId();
            String clientName = clientId != null
                    ? userRepository.findById(clientId).map(User::getFullName).orElse("Client")
                    : "Client";

            return ClientPaymentResponse.builder()
                    .paymentId(p.getPaymentId())
                    .applicationId(app.getApplicationId())
                    .jobId(app.getJob().getJobId())
                    .jobTitle(app.getJob().getTitle())
                    .workerName(app.getWorker().getFullName())
                    .clientName(clientName)
                    .amount(p.getAmount())
                    .status(p.getStatus().name())
                    .paidAt(p.getPaidAt())
                    .createdAt(p.getCreatedAt())
                    .build();
        }).toList();
    }

    private void notify(Integer userId, String message) {
        notificationRepository.save(Notification.builder()
                .userId(userId.longValue())
                .message(message)
                .unread(true)
                .build());
    }
}

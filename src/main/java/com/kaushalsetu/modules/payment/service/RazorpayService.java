package com.kaushalsetu.modules.payment.service;

import java.time.LocalDateTime;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.kaushalsetu.common.enums.ContractStatus;
import com.kaushalsetu.common.enums.PaymentStatus;
import com.kaushalsetu.common.enums.TransactionType;
import com.kaushalsetu.entity.Contract;
import com.kaushalsetu.entity.EscrowPayment;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.contract.repository.ContractRepository;
import com.kaushalsetu.modules.contract.service.ContractService;
import com.kaushalsetu.modules.payment.repository.OrganizationEscrowPaymentRepository;
import com.kaushalsetu.modules.wallet.service.WalletService;

import lombok.RequiredArgsConstructor;

/**
 * Direct-pay flow used by CLIENT role contracts (no escrow hold):
 * Worker marks work completed -> Client pays via Razorpay -> Worker wallet credited immediately.
 */
@Service
@RequiredArgsConstructor
public class RazorpayService {
    private final RazorpayClient client;
    private final OrganizationEscrowPaymentRepository repository;
    private final ContractRepository contractRepository;
    private final ContractService contractService;
    private final WalletService walletService;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    /**
     * CLIENT ONLY: creates a Razorpay order to pay a worker directly once work has been
     * submitted. (Organizations no longer use Razorpay — escrow funding is a plain CRUD
     * operation, see OrganizationEscrowPaymentServiceImpl.fundEscrow.)
     */
    @Transactional
    public String createOrder(double amount, Integer contractId) throws Exception {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ApiException("Contract not found"));

        if (contract.getStatus() != ContractStatus.WORK_SUBMITTED) {
            throw new ApiException("Work must be marked completed by the worker before you can pay");
        }

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (amount * 100));
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "contract_" + contractId);
        Order order = client.orders.create(orderRequest);
        String orderId = order.get("id");

        // Persist a PENDING payment row up-front so verification can find it by orderId.
        repository.save(EscrowPayment.builder()
                .contract(contract)
                .amount(amount)
                .razorpayOrderId(orderId)
                .paymentStatus(PaymentStatus.PENDING)
                .transactionType(TransactionType.DEPOSIT)
                .transactionDate(LocalDateTime.now())
                .build());

        return orderId;
    }

    /** CLIENT: verify payment signature, credit worker wallet immediately, complete the contract. */
    @Transactional
    public boolean verifyAndRelease(String orderId, String paymentId, String signature) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);

            if (!Utils.verifyPaymentSignature(attributes, keySecret)) {
                return false;
            }

            EscrowPayment payment = repository.findByRazorpayOrderId(orderId)
                    .orElseThrow(() -> new ApiException("Order ID not found: " + orderId));

            payment.setPaymentStatus(PaymentStatus.RELEASED);
            payment.setTransactionType(TransactionType.RELEASE);
            repository.save(payment);

            walletService.credit(
                    payment.getContract().getWorker().getUserId(),
                    payment.getAmount(),
                    payment.getContract().getContractId(),
                    "Direct payment received for contract #" + payment.getContract().getContractId()
            );

            contractService.completeContractById(payment.getContract().getContractId());
            return true;
        } catch (Exception e) {
            System.err.println("Verification Error: " + e.getMessage());
            return false;
        }
    }

    public List<EscrowPayment> getAllEscrowRecords() {
        return repository.findAll();
    }

    public List<EscrowPayment> getPaymentsByWorker(Integer workerId) {
        return repository.findByContract_Worker_UserId(workerId);
    }

    public List<EscrowPayment> getPaymentsByClient(Integer clientId) {
        return repository.findByContract_Client_UserId(clientId);
    }
}

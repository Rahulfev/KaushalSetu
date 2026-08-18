package com.kaushalsetu.modules.payment.service;

import com.kaushalsetu.entity.EscrowPayment;
import com.kaushalsetu.common.enums.PaymentStatus;
import com.kaushalsetu.common.enums.TransactionType;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.payment.repository.OrganizationEscrowPaymentRepository;
import com.kaushalsetu.modules.contract.service.ContractService;
import com.kaushalsetu.modules.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Organization escrow flow — plain CRUD, no payment gateway.
 * Fund Now:   PENDING      -> ESCROW_HELD   (money is "locked" in escrow, contract activates)
 * Approve:    ESCROW_HELD  -> RELEASED      (money is credited to the worker's wallet)
 */
@Service
@RequiredArgsConstructor
public class OrganizationEscrowPaymentServiceImpl implements OrganizationEscrowPaymentService {

	private final OrganizationEscrowPaymentRepository repository;
	private final ContractService contractService;
	private final WalletService walletService;

	@Override
	@Transactional
	public EscrowPayment fundEscrow(Integer escrowId) {
		EscrowPayment payment = repository.findById(escrowId)
				.orElseThrow(() -> new ApiException("Escrow payment not found"));

		if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
			throw new ApiException("Only PENDING escrow records can be funded");
		}

		payment.setPaymentStatus(PaymentStatus.ESCROW_HELD);
		payment.setTransactionType(TransactionType.DEPOSIT);
		payment.setTransactionDate(LocalDateTime.now());
		EscrowPayment saved = repository.save(payment);

		// 🔓 Escrow is now funded -> flip the contract to ACTIVE so work can start.
		contractService.activateAfterEscrowFunded(payment.getContract().getContractId());

		return saved;
	}

	@Override
	@Transactional
	public EscrowPayment releaseToWorker(Integer escrowId) {
		EscrowPayment payment = repository.findById(escrowId)
				.orElseThrow(() -> new ApiException("Escrow payment not found"));

		if (payment.getPaymentStatus() != PaymentStatus.ESCROW_HELD) {
			throw new ApiException("Only payments that are secured in escrow can be released");
		}

		payment.setPaymentStatus(PaymentStatus.RELEASED);
		payment.setTransactionType(TransactionType.RELEASE);
		EscrowPayment saved = repository.save(payment);

		walletService.credit(
				payment.getContract().getWorker().getUserId(),
				payment.getAmount(),
				payment.getContract().getContractId(),
				"Escrow released for contract #" + payment.getContract().getContractId()
		);
		contractService.completeContractById(payment.getContract().getContractId());

		return saved;
	}

	@Override
	public List<EscrowPayment> getAllPayments() {
		return repository.findAll();
	}

	@Override
	public List<EscrowPayment> getPaymentsForClient(Integer clientUserId) {
		return repository.findByContract_Client_UserId(clientUserId);
	}

	@Override
	public EscrowPayment getPaymentById(Integer escrowId) {
		return repository.findById(escrowId).orElseThrow(() -> new ApiException("Not Found"));
	}

	@Override
	public List<EscrowPayment> getPaymentsByContract(Integer contractId) {
		return repository.findByContract_ContractId(contractId);
	}

	@Override
	public List<EscrowPayment> getPaymentsByStatus(PaymentStatus status) {
		return repository.findByPaymentStatus(status);
	}

	@Override
	public List<EscrowPayment> getPaymentsByTransactionType(TransactionType type) {
		return repository.findByTransactionType(type);
	}
}

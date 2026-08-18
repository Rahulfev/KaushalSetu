package com.kaushalsetu.modules.contract.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaushalsetu.common.enums.ContractStatus;
import com.kaushalsetu.common.enums.JobStatus;
import com.kaushalsetu.common.enums.PaymentStatus;
import com.kaushalsetu.common.enums.TransactionType;
import com.kaushalsetu.entity.Contract;
import com.kaushalsetu.entity.EscrowPayment;
import com.kaushalsetu.entity.Job;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.modules.contract.dto.ContractResponse;
import com.kaushalsetu.modules.contract.dto.CreateContractRequest;
import com.kaushalsetu.modules.contract.repository.ContractRepository;
import com.kaushalsetu.modules.job.repository.JobRepository;
import com.kaushalsetu.modules.payment.repository.OrganizationEscrowPaymentRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.modules.wallet.service.WalletService;

import lombok.RequiredArgsConstructor;

/**
 * Drives the full contract lifecycle for BOTH roles:
 *
 * ORGANIZATION flow:
 *   PENDING_ACCEPTANCE -> ACCEPTED -> (escrow funded) -> ACTIVE
 *   -> WORK_SUBMITTED -> (org approves + escrow released) -> COMPLETED
 *
 * CLIENT flow (no escrow):
 *   PENDING_ACCEPTANCE -> ACCEPTED -> ACTIVE (worker starts immediately)
 *   -> WORK_SUBMITTED -> (client pays via Razorpay) -> COMPLETED
 */
@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final OrganizationEscrowPaymentRepository escrowPaymentRepository;
    private final WalletService walletService;

    // ───────────────── GENERATE CONTRACT (after negotiation) ─────────────────
    @Transactional
    public ContractResponse createContract(CreateContractRequest request, String username) {
        if (request.getJobId() == null) throw new IllegalArgumentException("jobId is required");
        if (request.getWorkerId() == null) throw new IllegalArgumentException("workerId is required");
        if (request.getAgreedAmount() == null) throw new IllegalArgumentException("agreedAmount is required");

        User client = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Organization/Client not found"));

        Job job = jobRepository.findById(request.getJobId().longValue())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User worker = userRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        contractRepository.findByJob_JobIdAndWorker_UserId(job.getJobId(), worker.getUserId())
                .ifPresent(c -> { throw new RuntimeException("Contract already exists for this job & worker"); });

        Contract contract = Contract.builder()
                .job(job)
                .client(client)
                .worker(worker)
                .contractTerms(request.getContractTerms())
                .agreedAmount(request.getAgreedAmount())
                .status(ContractStatus.PENDING_ACCEPTANCE)
                .build();

        Contract saved = contractRepository.save(contract);

        return map(saved);
    }

    // ───────────────── WORKER ACCEPTS CONTRACT ─────────────────
    @Transactional
    public ContractResponse acceptContract(Integer contractId, String email) {
        Contract contract = getOwnedContract(contractId, email, true);
        requireStatus(contract, ContractStatus.PENDING_ACCEPTANCE);

        if (contract.getWorker().getKycStatus() != com.kaushalsetu.common.enums.KycStatus.APPROVED) {
            throw new IllegalStateException(
                    "Complete your KYC verification before accepting contracts and receiving payments.");
        }

        boolean isOrganizationFlow = isOrganization(contract.getClient());

        if (isOrganizationFlow) {
            // Org must still fund escrow before work can start.
            contract.setStatus(ContractStatus.ACCEPTED);

            boolean escrowAlreadyExists = !escrowPaymentRepository
                    .findByContract_ContractId(contract.getContractId()).isEmpty();
            if (!escrowAlreadyExists) {
                escrowPaymentRepository.save(EscrowPayment.builder()
                        .contract(contract)
                        .amount(contract.getAgreedAmount())
                        .paymentStatus(PaymentStatus.PENDING)
                        .transactionType(TransactionType.DEPOSIT)
                        .transactionDate(LocalDateTime.now())
                        .build());
            }
        } else {
            // Client flow — no escrow gate, work can start right away.
            contract.setStatus(ContractStatus.ACTIVE);
            contract.setSignedAt(LocalDateTime.now());
            contract.setStartDate(LocalDate.now());
            contract.getJob().setStatus(JobStatus.IN_PROGRESS);
            jobRepository.save(contract.getJob());
        }

        return map(contractRepository.save(contract));
    }

    // ───────────────── WORKER REJECTS CONTRACT ─────────────────
    @Transactional
    public ContractResponse rejectContract(Integer contractId, String email) {
        Contract contract = getOwnedContract(contractId, email, true);
        requireStatus(contract, ContractStatus.PENDING_ACCEPTANCE);
        contract.setStatus(ContractStatus.REJECTED);
        return map(contractRepository.save(contract));
    }

    // ───────────────── CALLED INTERNALLY once escrow is funded (ORG flow) ─────────────────
    @Transactional
    public void activateAfterEscrowFunded(Integer contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        if (contract.getStatus() != ContractStatus.ACCEPTED) {
            throw new IllegalStateException("Contract must be ACCEPTED before escrow funding can activate it");
        }

        contract.setStatus(ContractStatus.ACTIVE);
        contract.setSignedAt(LocalDateTime.now());
        contract.setStartDate(LocalDate.now());
        contract.getJob().setStatus(JobStatus.IN_PROGRESS);
        jobRepository.save(contract.getJob());
        contractRepository.save(contract);
    }

    // ───────────────── WORKER MARKS WORK / MILESTONES COMPLETE ─────────────────
    @Transactional
    public ContractResponse submitWork(Integer contractId, String email) {
        Contract contract = getOwnedContract(contractId, email, true);
        requireStatus(contract, ContractStatus.ACTIVE);
        contract.setStatus(ContractStatus.WORK_SUBMITTED);
        return map(contractRepository.save(contract));
    }

    // ───────────────── ORGANIZATION APPROVES WORK -> RELEASES ESCROW ─────────────────
    @Transactional
    public ContractResponse approveWorkAndRelease(Integer contractId, String email) {
        Contract contract = getOwnedContract(contractId, email, false);
        requireStatus(contract, ContractStatus.WORK_SUBMITTED);

        if (!isOrganization(contract.getClient())) {
            throw new IllegalStateException("Client contracts are completed via direct payment, not approval");
        }

        List<EscrowPayment> payments = escrowPaymentRepository.findByContract_ContractId(contractId);
        EscrowPayment held = payments.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.ESCROW_HELD)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No funded escrow payment found for this contract"));

        held.setPaymentStatus(PaymentStatus.RELEASED);
        held.setTransactionType(TransactionType.RELEASE);
        escrowPaymentRepository.save(held);

        walletService.credit(
                contract.getWorker().getUserId(),
                held.getAmount(),
                contract.getContractId(),
                "Escrow released for contract #" + contract.getContractId()
        );

        return completeContract(contract);
    }

    /** Marks the contract COMPLETED (job too). Used by the escrow flow above and the client direct-pay flow. */
    @Transactional
    public ContractResponse completeContract(Contract contract) {
        contract.setStatus(ContractStatus.COMPLETED);
        contract.setEndDate(LocalDate.now());
        Job job = contract.getJob();
        job.setStatus(JobStatus.COMPLETED);
        jobRepository.save(job);
        return map(contractRepository.save(contract));
    }

    @Transactional
    public ContractResponse completeContractById(Integer contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        return completeContract(contract);
    }

    // ───────────────── GET SINGLE CONTRACT (either party may view) ─────────────────
    public ContractResponse getContract(Integer contractId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        if (!contract.isParticipant(user)) {
            throw new AccessDeniedException("You are not part of this contract");
        }
        return map(contract);
    }

    // ───────────────── MY CONTRACTS ─────────────────
    public List<ContractResponse> getMyContracts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRole().getRoleName();

        List<Contract> contracts = (role.equals("ORGANIZATION") || role.equals("CLIENT"))
                ? contractRepository.findByClient_UserId(user.getUserId())
                : contractRepository.findByWorker_UserId(user.getUserId());

        return contracts.stream().map(this::map).toList();
    }

    // ───────────────── HELPERS ─────────────────
    private Contract getOwnedContract(Integer contractId, String email, boolean requireWorker) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        boolean isWorker = contract.getWorker().getUserId().equals(user.getUserId());
        boolean isClientSide = contract.getClient().getUserId().equals(user.getUserId());

        if (requireWorker && !isWorker) {
            throw new AccessDeniedException("Only the assigned worker can perform this action");
        }
        if (!requireWorker && !isClientSide) {
            throw new AccessDeniedException("Only the organization/client can perform this action");
        }
        return contract;
    }

    private void requireStatus(Contract contract, ContractStatus expected) {
        if (contract.getStatus() != expected) {
            throw new IllegalStateException(
                    "Invalid contract state: expected " + expected + " but was " + contract.getStatus());
        }
    }

    private boolean isOrganization(User client) {
        return client.getRole() != null && "ORGANIZATION".equals(client.getRole().getRoleName());
    }

    private ContractResponse map(Contract c) {
        return ContractResponse.builder()
                .contractId(c.getContractId())
                .jobId(c.getJob().getJobId())
                .jobTitle(c.getJob().getTitle())
                .workerId(c.getWorker().getUserId())
                .workerName(c.getWorker().getFullName())
                .clientId(c.getClient().getUserId())
                .clientName(c.getClient().getFullName())
                .agreedAmount(c.getAgreedAmount())
                .contractTerms(c.getContractTerms())
                .status(c.getStatus())
                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .signedAt(c.getSignedAt())
                .build();
    }
}

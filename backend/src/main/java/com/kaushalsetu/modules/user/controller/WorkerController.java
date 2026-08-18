package com.kaushalsetu.modules.user.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaushalsetu.common.enums.ApplicationStatus;
import com.kaushalsetu.common.enums.ContractStatus;
import com.kaushalsetu.common.enums.PaymentStatus;
import com.kaushalsetu.common.enums.UserStatus;
import com.kaushalsetu.entity.Contract;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.entity.Worker;
import com.kaushalsetu.modules.contract.repository.ContractRepository;
import com.kaushalsetu.modules.job.repository.JobApplicationRepository;
import com.kaushalsetu.modules.job.repository.JobRepository;
import com.kaushalsetu.modules.payment.repository.OrganizationEscrowPaymentRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.modules.user.repository.WorkerRepository;
import com.kaushalsetu.modules.user.service.FileStorageService;

@RestController
@RequestMapping("/api/worker")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private OrganizationEscrowPaymentRepository escrowPaymentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private FileStorageService fileStorageService;

    private static final List<ContractStatus> OPEN_CONTRACT_STATUSES =
            List.of(ContractStatus.ACTIVE, ContractStatus.WORK_SUBMITTED);

    private User requireUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getWorkerProfile(Authentication authentication) {
        try {
            User user = requireUser(authentication);
            Worker worker = workerRepository.findByUser_UserId(user.getUserId()).orElse(null);

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("full_name", user.getFullName());
            result.put("phone", user.getPhone());
            result.put("email", user.getEmail());
            result.put("location", worker != null ? worker.getLocation() : null);
            result.put("skill_set", worker != null ? worker.getSkillSet() : null);
            result.put("category", worker != null ? worker.getCategory() : null);
            result.put("district", worker != null ? worker.getDistrict() : null);
            result.put("experience_years", worker != null ? worker.getExperienceYears() : null);
            result.put("languages_known", worker != null ? worker.getLanguagesKnown() : null);
            result.put("service_areas", worker != null ? worker.getServiceAreas() : null);
            result.put("profile_description", worker != null ? worker.getProfileDescription() : null);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Worker profile not found.");
        }
    }

    @PutMapping("/profile/update")
    public ResponseEntity<String> updateProfile(Authentication auth, @RequestBody Map<String, Object> data) {
        try {
            User user = requireUser(auth);

            // ✅ UPSERT LOGIC: Handles missing worker records automatically
            Worker worker = workerRepository.findByUser_UserId(user.getUserId())
                    .orElseGet(() -> {
                        Worker w = new Worker();
                        w.setUser(user);
                        return w;
                    });

            if (data.get("skill_set") != null) worker.setSkillSet(String.valueOf(data.get("skill_set")));
            if (data.get("category") != null) worker.setCategory(String.valueOf(data.get("category")));
            if (data.get("experience_years") != null) {
                Object raw = data.get("experience_years");
                Integer years = (raw instanceof Number)
                        ? ((Number) raw).intValue()
                        : (int) Double.parseDouble(String.valueOf(raw));
                worker.setExperienceYears(years);
            }
            if (data.get("location") != null) worker.setLocation(String.valueOf(data.get("location")));
            if (data.get("district") != null) {
                worker.setDistrict(com.kaushalsetu.common.enums.District.valueOf(String.valueOf(data.get("district"))));
            }
            if (data.get("languages_known") != null) worker.setLanguagesKnown(String.valueOf(data.get("languages_known")));
            if (data.get("service_areas") != null) worker.setServiceAreas(String.valueOf(data.get("service_areas")));
            if (data.get("profile_description") != null) worker.setProfileDescription(String.valueOf(data.get("profile_description")));

            workerRepository.save(worker);

            return ResponseEntity.ok("Profile synchronized successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Backend Error: " + e.getMessage());
        }
    }

    // KYC upload/status now lives in the dedicated /api/kyc module (KycController) —
    // see modules/kyc. The old raw-JDBC endpoints here wrote to columns that didn't even
    // match the KycDocument entity, so they were removed rather than fixed in place.

    @GetMapping("/contracts")
    public ResponseEntity<?> getMyContracts(Authentication auth) {
        try {
            User user = requireUser(auth);
            List<Contract> contracts = contractRepository.findByWorker_UserId(user.getUserId());

            // Match the original raw-SQL flat shape ("SELECT * FROM contracts ...")
            // instead of serializing nested JPA entities.
            List<Map<String, Object>> result = contracts.stream().map(c -> {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("contract_id", c.getContractId());
                row.put("job_job_id", c.getJob() != null ? c.getJob().getJobId() : null);
                row.put("worker_user_id", c.getWorker() != null ? c.getWorker().getUserId() : null);
                row.put("client_user_id", c.getClient() != null ? c.getClient().getUserId() : null);
                row.put("contract_terms", c.getContractTerms());
                row.put("agreed_amount", c.getAgreedAmount());
                row.put("status", c.getStatus());
                row.put("start_date", c.getStartDate());
                row.put("end_date", c.getEndDate());
                row.put("signed_at", c.getSignedAt());
                return row;
            }).toList();

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/wallet")
    public ResponseEntity<?> getWalletStats(Authentication auth) {
        try {
            User user = requireUser(auth);
            Integer workerId = user.getUserId();

            Double escrowBalance = escrowPaymentRepository.sumAmountByWorkerAndStatus(workerId, PaymentStatus.ESCROW_HELD);
            Double releasedBalance = contractRepository.sumAgreedAmountByWorkerAndStatuses(
                    workerId, List.of(ContractStatus.COMPLETED));

            List<Contract> contracts = contractRepository.findByWorker_UserIdOrderBySignedAtDesc(workerId);
            List<Map<String, Object>> transactions = contracts.stream().map(c -> {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("date", c.getSignedAt());
                row.put("description", c.getContractTerms());
                row.put("amount", c.getAgreedAmount());
                row.put("status", c.getStatus());
                return row;
            }).toList();

            return ResponseEntity.ok(Map.of(
                "escrowBalance", escrowBalance != null ? escrowBalance : 0.0,
                "releasedBalance", releasedBalance != null ? releasedBalance : 0.0,
                "transactions", transactions
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching wallet data: " + e.getMessage());
        }
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(Authentication auth) {
        try {
            User user = requireUser(auth);
            Integer workerId = user.getUserId();

            Double escrowBalance = escrowPaymentRepository.sumAmountByWorkerAndStatus(workerId, PaymentStatus.ESCROW_HELD);
            long appliedCount = jobApplicationRepository.countByWorker_UserIdAndStatusIn(
                    workerId, List.of(ApplicationStatus.APPLIED));
            long shortlistedCount = jobApplicationRepository.countByWorker_UserIdAndStatusIn(
                    workerId, List.of(ApplicationStatus.SHORTLISTED));

            Map<String, Object> stats = new LinkedHashMap<>();
            stats.put("full_name", user.getFullName());
            stats.put("escrow_balance", escrowBalance != null ? escrowBalance : 0.0);
            stats.put("applied_count", appliedCount);
            stats.put("shortlisted_count", shortlistedCount);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/active-jobs")
    public ResponseEntity<?> getActiveJobs(Authentication auth) {
        try {
            User user = requireUser(auth);
            List<Contract> contracts = contractRepository.findByWorker_UserIdAndStatusIn(
                    user.getUserId(), OPEN_CONTRACT_STATUSES);

            List<Map<String, Object>> activeJobs = contracts.stream().map(c -> {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("contract_id", c.getContractId());
                row.put("title", c.getJob() != null ? c.getJob().getTitle() : null);
                row.put("location", c.getJob() != null ? c.getJob().getLocation() : null);
                row.put("agreed_amount", c.getAgreedAmount());
                row.put("status", c.getStatus());
                row.put("start_date", c.getStartDate());
                row.put("end_date", c.getEndDate());
                return row;
            }).toList();

            return ResponseEntity.ok(activeJobs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching active jobs: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getContractHistory(Authentication auth) {
        try {
            User user = requireUser(auth);
            List<Contract> contracts = contractRepository.findByWorker_UserIdOrderBySignedAtDesc(user.getUserId());

            List<Map<String, Object>> history = contracts.stream().map(c -> {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("contract_id", c.getContractId());
                row.put("title", c.getJob() != null ? c.getJob().getTitle() : null);
                row.put("location", c.getJob() != null ? c.getJob().getLocation() : null);
                row.put("agreed_amount", c.getAgreedAmount());
                row.put("status", c.getStatus());
                row.put("signed_at", c.getSignedAt());
                return row;
            }).toList();

            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching history: " + e.getMessage());
        }
    }

    @PutMapping("/profile/deactivate")
    public ResponseEntity<String> deactivateProfile(Authentication auth) {
        try {
            User user = requireUser(auth);
            user.setStatus(UserStatus.INACTIVE);
            userRepository.save(user);
            return ResponseEntity.ok("Account deactivated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Deactivation failed: " + e.getMessage());
        }
    }

    @GetMapping("/my-district-jobs")
    public ResponseEntity<?> getJobsInMyDistrict(Authentication auth) {
        try {
            User user = requireUser(auth);
            Worker worker = workerRepository.findByUser_UserId(user.getUserId())
                    .orElseThrow(() -> new RuntimeException("Worker profile not found"));

            List<com.kaushalsetu.entity.Job> jobs = jobRepository.findByDistrictAndStatus(
                    worker.getDistrict().name(), com.kaushalsetu.common.enums.JobStatus.OPEN);

            List<Map<String, Object>> result = jobs.stream().map(j -> {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("job_id", j.getJobId());
                row.put("title", j.getTitle());
                row.put("description", j.getDescription());
                row.put("category", j.getCategory());
                row.put("budget", j.getBudget());
                row.put("location", j.getLocation());
                row.put("district", j.getDistrict());
                row.put("status", j.getStatus());
                row.put("posted_by_user_id", j.getPostedByUserId());
                row.put("created_at", j.getCreatedAt());
                User client = userRepository.findById(j.getPostedByUserId()).orElse(null);
                row.put("client_name", client != null ? client.getFullName() : null);
                return row;
            }).toList();

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching local jobs: " + e.getMessage());
        }
    }
}

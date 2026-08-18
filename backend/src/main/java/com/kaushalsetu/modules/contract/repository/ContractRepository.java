package com.kaushalsetu.modules.contract.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kaushalsetu.entity.Contract;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer> {

    List<Contract> findByClient_UserId(Integer userId);

    List<Contract> findByWorker_UserId(Integer userId);

    Optional<Contract> findByJob_JobIdAndWorker_UserId(
            Integer jobId,
            Integer workerId
    );

    boolean existsByClient_UserIdAndWorker_UserId(Integer clientId, Integer workerId);

    boolean existsByJob_JobId(Integer jobId);

    long countByWorker_UserIdAndStatus(Integer workerUserId, com.kaushalsetu.common.enums.ContractStatus status);

    List<Contract> findByWorker_UserIdAndStatusIn(Integer workerUserId, List<com.kaushalsetu.common.enums.ContractStatus> statuses);

    List<Contract> findByWorker_UserIdOrderBySignedAtDesc(Integer workerUserId);

    @org.springframework.data.jpa.repository.Query(
        "SELECT COALESCE(SUM(c.agreedAmount), 0) FROM Contract c " +
        "WHERE c.worker.userId = :workerId AND c.status IN :statuses"
    )
    Double sumAgreedAmountByWorkerAndStatuses(
        @org.springframework.data.repository.query.Param("workerId") Integer workerId,
        @org.springframework.data.repository.query.Param("statuses") List<com.kaushalsetu.common.enums.ContractStatus> statuses
    );
}


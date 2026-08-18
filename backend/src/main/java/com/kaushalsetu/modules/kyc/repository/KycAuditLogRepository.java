package com.kaushalsetu.modules.kyc.repository;

import com.kaushalsetu.entity.KycAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KycAuditLogRepository extends JpaRepository<KycAuditLog, Integer> {
    List<KycAuditLog> findByKyc_KycIdOrderByCreatedAtDesc(Integer kycId);
}

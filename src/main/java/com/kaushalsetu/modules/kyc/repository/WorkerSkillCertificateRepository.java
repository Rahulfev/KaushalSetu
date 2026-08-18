package com.kaushalsetu.modules.kyc.repository;

import com.kaushalsetu.entity.WorkerSkillCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerSkillCertificateRepository extends JpaRepository<WorkerSkillCertificate, Integer> {
    List<WorkerSkillCertificate> findByUser_UserId(Integer userId);
}

package com.kaushalsetu.modules.kyc.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaushalsetu.common.enums.KycStatus;
import com.kaushalsetu.entity.KycDocument;
import com.kaushalsetu.entity.User;

public interface KycRepository extends JpaRepository<KycDocument, Integer> {
	long countByStatus(KycStatus status);

	List<KycDocument> findTop2ByStatusOrderByVerifiedAtAsc(KycStatus status);

	List<KycDocument> findByStatusOrderByKycIdAsc(KycStatus status);

	boolean existsByUserAndStatus(User user, KycStatus status);

	Optional<KycDocument> findTopByUserOrderByKycIdDesc(User user);

	Optional<KycDocument> findTopByUser_UserIdOrderByKycIdDesc(Integer userId);

	List<KycDocument> findByUser_UserId(Integer userId);

	List<KycDocument> findAllByOrderByKycIdDesc();
}

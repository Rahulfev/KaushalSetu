package com.kaushalsetu.modules.admin.repository;

import com.kaushalsetu.entity.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {

    List<SystemLog> findTop10ByOrderByCreatedAtDesc();
}

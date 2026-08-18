package com.kaushalsetu.modules.user.repository;

import com.kaushalsetu.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Integer> {

    Optional<Worker> findByUser_UserId(Integer userId);
}

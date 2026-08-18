package com.kaushalsetu.modules.user.repository; // ✅ Double check this path

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kaushalsetu.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserIdAndUnreadTrue(Integer userId);
}
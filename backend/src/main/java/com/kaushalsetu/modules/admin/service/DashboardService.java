package com.kaushalsetu.modules.admin.service;

import java.lang.management.ManagementFactory;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaushalsetu.common.enums.UserStatus;
import com.kaushalsetu.common.enums.JobStatus; // ✅ Import JobStatus Enum
import com.kaushalsetu.entity.SystemLog;
import com.kaushalsetu.modules.admin.dto.DashboardStatsDTO;
import com.kaushalsetu.modules.admin.repository.SystemLogRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;

// ✅ CORRECT IMPORT for JobRepository
import com.kaushalsetu.modules.job.repository.JobRepository; 

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SystemLogRepository logRepository;

    @Autowired
    private JobRepository jobRepository;

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        // --- USER STATS ---
        stats.setTotalUsers(userRepository.count());
        stats.setActiveUsers(userRepository.findByStatus(UserStatus.ACTIVE).size());

        // --- JOB STATS (Now using Real Enums) ---
        stats.setTotalJobs(jobRepository.count());
        
        // ✅ Use Enum constants, not Strings
        stats.setOngoingJobs(jobRepository.countByStatus(JobStatus.IN_PROGRESS)); 
        stats.setCompletedJobs(jobRepository.countByStatus(JobStatus.COMPLETED));

        // --- REVENUE ---
        stats.setTotalRevenue(0.0);

        // --- SYSTEM HEALTH ---
        long uptimeMillis = ManagementFactory.getRuntimeMXBean().getUptime();
        long uptimeHours = Duration.ofMillis(uptimeMillis).toHours();
        stats.setUptime(uptimeHours + " Hours");
        stats.setStatus("Healthy");

        return stats;
    }

 // 2. Fetch Logs (Real Implementation with Correct JSON Keys)
    public List<Map<String, Object>> getSystemLogs() {
        List<SystemLog> logs = logRepository.findTop10ByOrderByCreatedAtDesc();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (SystemLog log : logs) {
            Map<String, Object> map = new HashMap<>();
            
            // 1. Match Frontend "TIMESTAMP" column
            map.put("timestamp", log.getCreatedAt().toString()); 

            // 2. Match Frontend "MESSAGE" column (We use 'action' as the message)
            map.put("message", log.getAction()); 

            // 3. Match Frontend "LEVEL" column (Default to "INFO" since DB doesn't have it yet)
            map.put("level", "INFO"); 

            // 4. Match Frontend "MODULE" column (Default to "SYSTEM")
            map.put("module", "ADMIN");
            
            result.add(map);
        }
        return result;
    }
}
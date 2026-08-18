package com.kaushalsetu.modules.admin.dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    // User Stats (Real)
    private long totalUsers;
    private long activeUsers; 
    
    // Job Stats (Mocked for now)
    private long totalJobs;
    private long ongoingJobs;
    private long completedJobs;
    
    // Financial (Mocked for now)
    private double totalRevenue;
    
    // System Health
    private String uptime;
    private String status;
}
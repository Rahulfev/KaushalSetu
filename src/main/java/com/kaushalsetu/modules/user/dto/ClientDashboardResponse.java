package com.kaushalsetu.modules.user.dto;

import lombok.Data;
import java.util.List;

@Data
public class ClientDashboardResponse {
    private DashboardStats stats;
    private List<RecentJobResponse> recentJobs;
    
    @Data
    public static class DashboardStats {
        private long activeJobs;
        private long completedJobs;
        private double totalSpent;
        private long pendingApplications;
    }
    
    @Data
    public static class RecentJobResponse {
        private Integer jobId;
        private String title;
        private String status;
        private String createdAt;
        private long applicationCount;
    }
}
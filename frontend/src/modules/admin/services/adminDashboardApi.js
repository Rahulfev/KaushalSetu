import axiosInstance from '../../../services/axiosInstance';

// --- EXPANDED MOCK DATA ---
const MOCK_MONITORING_STATS = {
  // User Stats
  totalUsers: 1250,
  activeUsers24h: 142, // "Active users (last 24 hours)"
  
  // Job Stats
  totalJobs: 450,
  ongoingJobs: 35,     // "Ongoing jobs"
  completedJobs: 405,  // "Completed jobs"
  
  // Financial
  totalRevenue: 540000, // "Payment transaction summary"
  
  // System Health
  serverStatus: "Healthy",
  uptime: "99.98%",     // "System uptime status"
  lastRestart: "14 days ago"
};

const MOCK_SYSTEM_LOGS = [
  { id: 101, level: "Error", message: "Payment Gateway Timeout", module: "Payments", timestamp: "2026-01-22 10:30 AM" },
  { id: 102, level: "Warning", message: "High Memory Usage (85%)", module: "Server", timestamp: "2026-01-22 11:15 AM" },
  { id: 103, level: "Info", message: "New Supervisor Registered", module: "Auth", timestamp: "2026-01-22 12:00 PM" },
  { id: 104, level: "Error", message: "SMS API Failed", module: "Notifications", timestamp: "2026-01-22 01:45 PM" },
  { id: 105, level: "Info", message: "Database Backup Completed", module: "System", timestamp: "2026-01-22 03:00 AM" },
];

export const fetchMonitoringStats = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_MONITORING_STATS), 500));
};

export const fetchSystemLogs = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_SYSTEM_LOGS), 500));
};
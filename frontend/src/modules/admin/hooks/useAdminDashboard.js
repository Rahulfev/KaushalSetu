import { useState, useEffect } from 'react';
// Navigate up from: src/modules/admin/hooks/ -> src/services/
import AdminService from '../../../services/adminService'; 

const useAdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers24h: 0,
        totalRevenue: 0,
        totalJobs: 0,
        ongoingJobs: 0,
        completedJobs: 0,
        uptime: "Loading...",
        lastRestart: "-"
    });
    
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
        
        // Auto-refresh data every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            // 1. Fetch Stats & Logs in parallel
            const [statsRes, logsRes] = await Promise.all([
                AdminService.getDashboardStats(),
                AdminService.getSystemLogs()
            ]);

            // 2. Update Stats State
            setStats({
                ...statsRes.data,
                // Map backend 'activeUsers' to frontend 'activeUsers24h'
                activeUsers24h: statsRes.data.activeUsers, 
                // Create a readable restart time
                lastRestart: new Date().toLocaleDateString() 
            });
            
            // 3. Update Logs State
            setLogs(logsRes.data);
            setLoading(false);

        } catch (err) {
            console.error("Dashboard API Error:", err);
            // If backend is down, keep loading false so UI shows error
            setError("Cannot connect to server. Is Spring Boot running?");
            setLoading(false);
        }
    };

    return { stats, logs, loading, error };
};

export default useAdminDashboard;
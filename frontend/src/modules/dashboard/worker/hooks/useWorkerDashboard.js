import { useState, useEffect } from 'react';
import { workerApi } from '../services/workerDashboardApi';

export const useWorkerDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [myApplications, setMyApplications] = useState([]);

    const loadDashboardData = async () => {
        try {
            const profileRes = await workerApi.getProfile();
            setProfile(profileRes.data);
            
            // Auto-load jobs based on worker's location
            const jobRes = await workerApi.getJobFeed(profileRes.data.district);
            setJobs(jobRes.data);

            const appRes = await workerApi.getApplicationStatus();
            setMyApplications(appRes.data);
        } catch (err) {
            console.error("Dashboard load failed", err);
        }
    };

    useEffect(() => { loadDashboardData(); }, []);

    return { profile, jobs, myApplications, refresh: loadDashboardData };
};
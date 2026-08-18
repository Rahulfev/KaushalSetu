// src/modules/dashboard/worker/services/workerDashboardApi.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// export const workerApi = {
//     getProfile: () => apiClient.get('/worker/profile'),
//     getDashboardStats: () => apiClient.get('/worker/dashboard-stats'),
//     getJobFeed: (district) => apiClient.get('/jobs/feed', { params: { district } }),
//     applyToJob: (jobId) => apiClient.post(`/applications/apply/${jobId}`),
//     getMyApplications: () => apiClient.get('/applications/my-status'), 
//     getActiveJobs: () => apiClient.get('/worker/active-jobs'),
    
//     // ✅ ADD THIS MISSING METHOD TO FIX THE ERROR
//     getHistory: () => apiClient.get('/worker/history'),
    
//     getMyContracts: () => apiClient.get('/worker/contracts'),
//     getWalletStats: () => apiClient.get('/worker/wallet'),
// };

export const workerApi = {
    getProfile: () => apiClient.get('/worker/profile'),
    getDashboardStats: () => apiClient.get('/worker/dashboard-stats'),
    getJobFeed: (district) => apiClient.get('/jobs/feed', { params: { district } }),
    applyToJob: (jobId, applicationData) => apiClient.post(`/applications/apply/${jobId}`, applicationData || {}),
    startService: (applicationId) => apiClient.put(`/applications/${applicationId}/start-service`),
    completeService: (applicationId) => apiClient.put(`/applications/${applicationId}/complete-service`),
    getMyPaymentHistory: () => apiClient.get('/client/payments/my-history'),
    getMyApplications: () => apiClient.get('/applications/my-status'), 
    getActiveJobs: () => apiClient.get('/worker/active-jobs'),
    getHistory: () => apiClient.get('/worker/history'),
    getMyContracts: () => apiClient.get('/worker/contracts'),
    getWalletStats: () => apiClient.get('/worker/wallet'),

    // ✅ ADD THESE TWO MISSING METHODS:
    updateProfile: (data) => apiClient.put('/worker/profile/update', data),
    deactivateAccount: () => apiClient.put('/worker/profile/deactivate'),

    // ✅ Marks a contract as COMPLETED once the worker has finished the job.
    // This is what triggers the organization's "Fund Now" payment step.
    markJobComplete: (contractId) =>
        apiClient.put(`/contracts/${contractId}/status`, null, {
            params: { status: 'COMPLETED' },
        }),
};
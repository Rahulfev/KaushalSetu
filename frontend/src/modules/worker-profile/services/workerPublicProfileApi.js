import axiosInstance from '@/services/axiosInstance';

// Read-only, non-sensitive worker profile — for clients/organizations reviewing a candidate.
export const getWorkerPublicProfile = (workerId) =>
  axiosInstance.get(`/workers/${workerId}/public-profile`);

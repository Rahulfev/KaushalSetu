import axiosInstance from '@/services/axiosInstance';

// ───────────────── CORE ─────────────────
export const createContractApi = (payload) =>
  axiosInstance.post('/contracts', payload);

export const getMyContractsApi = () =>
  axiosInstance.get('/contracts/my');

export const getContractApi = (id) =>
  axiosInstance.get(`/contracts/${id}`);

// ───────────────── LIFECYCLE ─────────────────
// WORKER: accept a generated contract.
//   Organization contracts -> ACCEPTED (org must still fund escrow)
//   Client contracts       -> ACTIVE   (worker can start immediately)
export const acceptContractApi = (id) =>
  axiosInstance.put(`/contracts/${id}/accept`);

// WORKER: reject a generated contract.
export const rejectContractApi = (id) =>
  axiosInstance.put(`/contracts/${id}/reject`);

// WORKER: mark work / milestones as completed.
export const submitWorkApi = (id) =>
  axiosInstance.put(`/contracts/${id}/submit-work`);

// ORGANIZATION ONLY: approve submitted work -> releases escrow -> credits worker wallet.
export const approveWorkApi = (id) =>
  axiosInstance.put(`/contracts/${id}/approve-work`);

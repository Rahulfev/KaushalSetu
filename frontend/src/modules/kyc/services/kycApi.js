import axios from '@/services/axiosInstance';

export const fetchAllKycs = (role, status) =>
  axios.get('/admin/kyc', { params: status ? { status } : {} });

export const fetchKycDetail = (role, kycId) =>
  axios.get(`/admin/kyc/${kycId}`);

// decision: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'REUPLOAD_REQUESTED'
export const decideKyc = (role, kycId, decision, remarks) =>
  axios.post(`/admin/kyc/${kycId}/decision`, { decision, remarks });

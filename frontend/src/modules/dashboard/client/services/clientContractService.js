import axiosInstance from "../../../../services/axiosInstance";

export const createContract = (clientId, data) => {
  return axiosInstance.post(`/contracts?clientId=${clientId}`, data);
};

export const getClientContracts = (clientId) => {
  return axiosInstance.get(`/contracts?clientId=${clientId}`);
};

export const updateContractStatus = (contractId, status) => {
  return axiosInstance.patch(`/contracts/${contractId}/status?status=${status}`);
};

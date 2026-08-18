// src/services/organizationPaymentService.js
import axios from '@/services/axiosInstance';

const BASE_URL = '/organization/payments';

export const getAllPayments = () => {
  return axios.get(BASE_URL);
};

export const getPaymentById = (escrowId) => {
  return axios.get(`${BASE_URL}/${escrowId}`);
};

export const getPaymentsByContract = (contractId) => {
  return axios.get(`${BASE_URL}/contract/${contractId}`);
};

export const getPaymentsByStatus = (status) => {
  return axios.get(`${BASE_URL}/status/${status}`);
};

export const getPaymentsByType = (type) => {
  return axios.get(`${BASE_URL}/type/${type}`);
};

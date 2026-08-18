import axiosInstance from "@/services/axiosInstance";

export const createPayNowOrder = (applicationId, amount) =>
  axiosInstance.post("/client/payments/create-order", { applicationId, amount });

export const verifyPayNowPayment = (payload) =>
  axiosInstance.post("/client/payments/verify", payload);

export const getMyPaymentHistory = () =>
  axiosInstance.get("/client/payments/my-history");

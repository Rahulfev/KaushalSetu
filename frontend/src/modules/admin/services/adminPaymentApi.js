import axiosInstance from '../../../services/axiosInstance';

export const createPaymentOrder = async (amount, contractId) => {
    const { data } = await axiosInstance.post('/payments/create-order', {
        amount,
        contractId
    });
    return data; // Returns { orderId: "order_..." }
};

export const verifyPaymentSignature = async (paymentDetails) => {
    const { data } = await axiosInstance.post('/payments/verify-payment', paymentDetails);
    return data;
};
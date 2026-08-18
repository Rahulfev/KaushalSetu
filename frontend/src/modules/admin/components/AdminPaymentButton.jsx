import React from 'react';
import { toast } from 'react-toastify';
import { createPaymentOrder, verifyPaymentSignature } from '../services/adminPaymentApi';

const AdminPaymentButton = ({ amount, contractId, onSuccess }) => {

    const handlePayment = async () => {
        try {
            // 1. Create Order in Backend
            const orderData = await createPaymentOrder(amount, contractId);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount * 100, // Amount in paise
                currency: "INR",
                name: "KaushalSetu",
                description: `Escrow Deposit for Contract #${contractId}`,
                order_id: orderData.orderId,
                handler: async function (response) {
                    // 2. Verify Signature
                    try {
                        await verifyPaymentSignature({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        toast.success("Payment successful and verified!");
                        if (onSuccess) onSuccess();
                    } catch (err) {
                        toast.error("Signature verification failed.");
                    }
                },
                prefill: { name: "Admin", email: "admin@kaushalsetu.com" },
                theme: { color: "#3399cc" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment initiation failed:", error);
            toast.error("Could not start payment. Check console.");
        }
    };

    return (
        <button onClick={handlePayment} className="px-4 py-2 bg-blue-600 text-white rounded">
            Pay ₹{amount} to Escrow
        </button>
    );
};

export default AdminPaymentButton;

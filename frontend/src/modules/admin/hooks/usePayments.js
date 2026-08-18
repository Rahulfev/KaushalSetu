import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../services/axiosInstance'; 

const usePayments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH REAL DATA FROM BACKEND
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      // Calls @GetMapping("/all") in your PaymentOrderController
      const response = await axiosInstance.get('/payments/all'); 
      setTransactions(response.data || []);
    } catch (error) {
      console.error("Error fetching real database payments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // ✅ REAL RELEASE LOGIC
  const releaseEscrow = async (contractId) => {
    if (!window.confirm("Are you sure you want to release these funds to the worker?")) return;
    
    try {
      // Calls @PostMapping("/release/{contractId}") in your Backend
      await axiosInstance.post(`/payments/release/${contractId}`); 
      toast.success("Funds released successfully!");
      fetchPayments(); // Refresh real data from DB
    } catch (error) {
      toast.error("Failed to release funds. Ensure the job is marked as completed.");
    }
  };

  return { transactions, loading, releaseEscrow, fetchPayments };
};

export default usePayments;
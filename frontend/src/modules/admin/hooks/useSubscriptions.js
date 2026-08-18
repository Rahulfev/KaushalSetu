import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const useSubscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/plans');
      const data = await response.json();
      
      const formatted = data.map(p => ({
        ...p,
        // ✅ Ensure planId is mapped regardless of backend casing
        planId: p.planId || p.plan_id, 
        features: typeof p.features === 'string' ? p.features.split(',') : (p.features || [])
      }));
      setPlans(formatted);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updatePlanDetails = async (planId, updatedData) => {
    if (!planId) return console.error("Update failed: planId is undefined");

    try {
      const response = await fetch(`http://localhost:8080/api/admin/plans/${planId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        toast.success("Plan updated successfully!");
        fetchData();
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const createPlan = async (newPlan) => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlan),
      });
      if (response.ok) {
        toast.success("Plan created successfully!");
        fetchData();
      }
    } catch (err) {
      console.error("Creation failed:", err);
    }
  };

  return { plans, loading, updatePlanDetails, createPlan };
};

export default useSubscriptions;
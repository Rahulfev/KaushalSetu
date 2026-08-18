import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminService from '../../../services/adminService'; 

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getAllUsers();
      // ✅ Ensure we handle nested data if your API wraps the list
      setUsers(Array.isArray(res) ? res : res.data || []); 
    } catch (err) {
      console.error("Error fetching users:", err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

    try {
      // ✅ Calling real backend endpoint
      await AdminService.updateUserStatus(userId, newStatus);
      setUsers(prev => prev.map(u => u.userId === userId ? { ...u, status: newStatus } : u));
      toast.success(`User status updated to ${newStatus}`);
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Failed to update status. Please try again.");
    }
  };

  return {
    users,
    loading,
    error,
    handleToggleStatus,
    refetch: fetchUsers
  };
};

export default useUserManagement;
// hooks/useAuth.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginApi } from '../services/authApi';
import { saveToken, clearToken } from '@/shared/utils/tokenUtils';
import { clearAuth } from '@/shared/utils/authUtils';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      setLoading(true);

      const data = await loginApi(credentials);

      saveToken(data.token);

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userName', data.fullName || '');
      localStorage.setItem('userId', data.userId);

      toast.success(`Welcome back, ${data.fullName || 'there'}!`);

      // 🚦 EMAIL CHECK
      if (data.emailStatus !== 'VERIFIED') {
        navigate('/verify-email');
        return;
      }

      // 🪪 KYC CHECK
      if (data.kycStatus !== 'APPROVED') {
        navigate('/kyc-pending');
        return;
      }

      // 🔐 ACCOUNT STATUS
      if (data.accountStatus !== 'ACTIVE') {
        navigate('/login');
        return;
      }

      // 🚀 ROLE BASED REDIRECT
      switch (data.role) {
        case 'WORKER':
          navigate('/worker/dashboard');
          break;
        case 'CLIENT':
          navigate('/client/dashboard');
          break;
        case 'ORGANIZATION':
          navigate('/organization/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/users');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    clearAuth();
    localStorage.clear();
    navigate('/login');
  };

  return { login, logout, loading };
};

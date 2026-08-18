import axiosInstance from '@/services/axiosInstance';

export const loginApi = async (payload) => {
  // ✅ Backend AuthService looks for "username"
  const { data } = await axiosInstance.post('/auth/login', {
    username: payload.username, 
    password: payload.password,
  });
  return data;
};

export const registerApi = async (payload) => {
  const { data } = await axiosInstance.post('/auth/register', payload);
  return data;
};

// Forgot Password — Step 1: send OTP to the user's email
export const forgotPasswordApi = (email) => {
  return axiosInstance.post('/auth/forgot-password', { email });
};

// Forgot Password — Step 2: verify the OTP before showing the new-password fields
export const verifyOtpApi = (email, otp) => {
  return axiosInstance.post('/auth/verify-otp', { email, otp });
};

// Forgot Password — Step 3: submit OTP + new password to complete the reset
export const resetPasswordApi = (email, otp, newPassword, confirmPassword) => {
  return axiosInstance.post('/auth/reset-password', {
    email,
    otp,
    newPassword,
    confirmPassword,
  });
};

// Country codes for the phone number dropdown (falls back to the local constant list if this fails)
export const getCountryCodesApi = () => {
  return axiosInstance.get('/meta/country-codes');
};

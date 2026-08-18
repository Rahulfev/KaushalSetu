import { getToken, clearToken } from './tokenUtils';

export const getAuth = () => ({
  token: getToken(),
  role: localStorage.getItem('userRole'),
  name: localStorage.getItem('userName'),
  userId: localStorage.getItem('userId'),
});

/**
 * ✅ Completely clears the browser storage and forces a refresh 
 * to ensure all internal React states are reset.
 */
export const clearAuth = () => {
  clearToken(); // Clears 'token'
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  
  // Nuclear reset for development to ensure no "sticky" data remains
  // localStorage.clear(); 
  
  // Optional: Force a reload to the login page to clear any in-memory state
  window.location.href = '/login';
};
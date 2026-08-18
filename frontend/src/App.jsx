import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { clearAuth, getAuth } from './shared/utils/authUtils';
import AIChatBubble from './shared/components/AIChatBubble';

const App = () => {
  useEffect(() => {
    const { token, name } = getAuth();
    // localStorage.clear(); 
    // console.log("Application restarted: Storage cleared.");
    
    /**
     * ✅ Session Sanitizer
     * If we have a user name but the token is missing, the session is corrupted.
     * We clear everything to force a fresh login.
     */
    if (name && !token) {
      console.warn("Corrupted session detected. Resetting...");
      clearAuth();
    }
  }, []);

  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme="colored"
      />
      <AppRoutes />
      <AIChatBubble />
    </>
  );
};

export default App;
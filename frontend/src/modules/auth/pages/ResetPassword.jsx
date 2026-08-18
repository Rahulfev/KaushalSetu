import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// The password reset flow is now OTP-based and lives entirely on the
// /forgot-password page (enter email -> enter OTP + new password).
// This route is kept only so old/bookmarked links don't break.
const ResetPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/forgot-password", { replace: true });
  }, [navigate]);

  return null;
};

export default ResetPassword;

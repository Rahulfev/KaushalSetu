import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPasswordApi, verifyOtpApi, resetPasswordApi } from "../services/authApi";
import {
  forgotPasswordEmailSchema,
  otpAndPasswordSchema,
  validateWithYup,
} from "../validation/authSchemas";

// Multi-step flow:
// STEP 1: enter email -> "Continue" sends an OTP to that email
// STEP 2: enter the OTP + new password -> submit to reset the password
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submitEmail = async (e) => {
    e.preventDefault();
    const { valid, errors: validationErrors } = await validateWithYup(
      forgotPasswordEmailSchema,
      { email }
    );
    setErrors(validationErrors);
    if (!valid) return;

    setLoading(true);
    try {
      await forgotPasswordApi(email);
      toast.success("An OTP has been sent to your email!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Account not found.");
    } finally {
      setLoading(false);
    }
  };

  const submitOtpAndPassword = async (e) => {
    e.preventDefault();
    const values = { otp, newPassword, confirmPassword };
    const { valid, errors: validationErrors } = await validateWithYup(
      otpAndPasswordSchema,
      values
    );
    setErrors(validationErrors);
    if (!valid) return;

    setLoading(true);
    try {
      // Optional pre-check for a clearer error message before showing password mismatch etc.
      await verifyOtpApi(email, otp);
      await resetPasswordApi(email, otp, newPassword, confirmPassword);
      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      toast.success("A new OTP has been sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: '#f8fafc' }}>
      <div className="bg-white p-5 shadow-lg text-center" style={{ maxWidth: '450px', borderRadius: '40px' }}>
        <div className="bg-warning bg-opacity-25 rounded-circle d-inline-flex p-3 mb-3">
          <i className="bi bi-key-fill fs-3 text-warning"></i>
        </div>

        {step === 1 && (
          <>
            <h3 className="fw-bold">Password Recovery</h3>
            <p className="text-muted small mb-4">Enter your email and we'll send you an OTP.</p>

            <Form onSubmit={submitEmail} noValidate>
              <InputGroup className="bg-light rounded-3 p-1 mb-1">
                <InputGroup.Text className="bg-transparent border-0"><i className="bi bi-envelope"></i></InputGroup.Text>
                <Form.Control
                  type="email"
                  className="bg-transparent border-0 py-2"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!errors.email}
                />
              </InputGroup>
              {errors.email && <div className="text-danger small text-start mb-3">{errors.email}</div>}
              {!errors.email && <div className="mb-3" />}

              <Button type="submit" className="w-100 py-3 fw-bold border-0" style={{ background: '#facc15', color: '#000', borderRadius: '15px' }} disabled={loading}>
                {loading ? "Sending..." : "Continue"}
              </Button>
            </Form>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="fw-bold">Enter OTP & New Password</h3>
            <p className="text-muted small mb-4">
              We've sent a 6-digit OTP to <strong>{email}</strong>. Enter it below along with your new password.
            </p>

            <Form onSubmit={submitOtpAndPassword} noValidate>
              <InputGroup className="bg-light rounded-3 p-1 mb-1">
                <InputGroup.Text className="bg-transparent border-0"><i className="bi bi-shield-lock"></i></InputGroup.Text>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  className="bg-transparent border-0 py-2 text-center fw-bold"
                  style={{ letterSpacing: '0.4em' }}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  isInvalid={!!errors.otp}
                />
              </InputGroup>
              {errors.otp && <div className="text-danger small text-start mb-2">{errors.otp}</div>}

              <InputGroup className="bg-light rounded-3 p-1 mb-1 mt-2">
                <InputGroup.Text className="bg-transparent border-0"><i className="bi bi-lock"></i></InputGroup.Text>
                <Form.Control
                  type="password"
                  className="bg-transparent border-0 py-2"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  isInvalid={!!errors.newPassword}
                />
              </InputGroup>
              {errors.newPassword && <div className="text-danger small text-start mb-2">{errors.newPassword}</div>}

              <InputGroup className="bg-light rounded-3 p-1 mb-1 mt-2">
                <InputGroup.Text className="bg-transparent border-0"><i className="bi bi-lock-fill"></i></InputGroup.Text>
                <Form.Control
                  type="password"
                  className="bg-transparent border-0 py-2"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={!!errors.confirmPassword}
                />
              </InputGroup>
              {errors.confirmPassword && <div className="text-danger small text-start mb-3">{errors.confirmPassword}</div>}

              <Button type="submit" className="w-100 py-3 fw-bold border-0 mt-3" style={{ background: '#facc15', color: '#000', borderRadius: '15px' }} disabled={loading}>
                {loading ? "Updating..." : "Reset Password"}
              </Button>
            </Form>

            <button
              type="button"
              className="btn btn-link small fw-bold mt-3 text-decoration-none"
              onClick={resendOtp}
              disabled={loading}
            >
              Didn't get it? Resend OTP
            </button>
          </>
        )}

        <Link to="/login" className="d-block mt-3 text-decoration-none small fw-bold">Back to Sign In</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;

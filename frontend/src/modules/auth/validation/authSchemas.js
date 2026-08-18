import * as yup from "yup";
import { COUNTRY_CODES } from "@/shared/constants/countryCodes";

const validDialCodes = COUNTRY_CODES.map((c) => c.dialCode);


const passwordRule = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=]).{8,}$/;

export const loginSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Email or phone number is required"),
  password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
  countryCode: yup
    .string()
    .oneOf(validDialCodes, "Please select a valid country code")
    .required("Country code is required"),
  phone: yup
    .string()
    .trim()
    .matches(/^[0-9]{6,14}$/, "Phone number must be 6 to 14 digits")
    .required("Phone number is required"),
  password: yup
    .string()
    .matches(
      passwordRule,
      "Password needs 8+ characters, 1 uppercase letter, 1 number and 1 special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
  role: yup.string().required("Please select a role"),
});

export const forgotPasswordEmailSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

export const otpAndPasswordSchema = yup.object({
  otp: yup
    .string()
    .trim()
    .matches(/^[0-9]{6}$/, "Enter the 6-digit OTP sent to your email")
    .required("OTP is required"),
  newPassword: yup
    .string()
    .matches(
      passwordRule,
      "Password needs 8+ characters, 1 uppercase letter, 1 number and 1 special character"
    )
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your password"),
});


export const validateWithYup = async (schema, values) => {
  try {
    await schema.validate(values, { abortEarly: false });
    return { valid: true, errors: {} };
  } catch (err) {
    const errors = {};
    if (err.inner && err.inner.length) {
      err.inner.forEach((e) => {
        if (e.path && !errors[e.path]) errors[e.path] = e.message;
      });
    } else if (err.path) {
      errors[err.path] = err.message;
    }
    return { valid: false, errors };
  }
};

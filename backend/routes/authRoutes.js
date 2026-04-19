import express from "express";

import {
  forgotPassword,
  verifyOtp,
  resetPassword,
  login,
  loginSalesman,
  sendOtpPhone,
  verifyOtpPhone,
  changeFirstPassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/login", login);
router.post("/login-salesman", loginSalesman);
router.post("/send-otp-phone", sendOtpPhone);
router.post("/verify-otp-phone", verifyOtpPhone);
router.post("/change-first-password", changeFirstPassword);

export default router;
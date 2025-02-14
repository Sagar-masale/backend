import { Router } from "express";
import { sendOtp, verifyOtp, requestOtp, verifyOtpAndResetPassword  } from  "../Auth/otpController.js";

const authRoutes = Router();

authRoutes.route("/send-otp").post(sendOtp)
authRoutes.route("/verify-otp").post(verifyOtp);
authRoutes.route("/request-otp").post(requestOtp)
authRoutes.route("/verify-otp-reset-password").post(verifyOtpAndResetPassword);

export default authRoutes;

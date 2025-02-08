import { Router } from "express";
import { sendOtp, verifyOtp } from  "../Auth/otpController.js";

const authRoutes = Router();

authRoutes.route("/send-otp").post(sendOtp)
authRoutes.route("/verify-otp").post(verifyOtp);

export default authRoutes;

import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { sendOtpEmail } from "./sendOtpEmail.js"; // Corrected import

const otpStore = new Map();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new apiError(400, "Email is required");
    }

    const otp = generateOTP();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    await sendOtpEmail(email, otp);
    return res.status(200).json(new apiResponse(200, {}, "OTP sent successfully"));
});

export const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new apiError(400, "Email and OTP are required");
    }

    const storedOtpData = otpStore.get(email);
    if (!storedOtpData || storedOtpData.otp !== otp) {
        throw new apiError(400, "Invalid or expired OTP");
    }

    otpStore.delete(email);
    return res.status(200).json(new apiResponse(200, {}, "OTP verified successfully"));
});

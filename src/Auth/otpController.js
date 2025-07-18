import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { sendOtpEmail } from "./sendOtpEmail.js";
import { User } from "../models/user.model.js";


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




export const requestOtp = asyncHandler(async (req, res) => {
    const { emailOrPhone } = req.body;

    const user = await User.findOne({
        $or: [
          { email: emailOrPhone },
          { phoneNumber: emailOrPhone }
        ]
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

 
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

 
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();


    await sendOtpEmail(user.email, otp);

    res.status(200).json({ message: 'OTP sent successfully.' });
});


export const verifyOtpAndResetPassword = async (req, res) => {
    const { emailOrPhone, otp, newPassword } = req.body;

    try {
      
        const user = await User.findOne({
            $or: [
                { email: emailOrPhone },
                { phoneNumber: emailOrPhone }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

  
        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ message: 'OTP not found or expired.' });
        }

    
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }
        if (Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'OTP has expired.' });
        }

 
        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

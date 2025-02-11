import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD, // App password from Google
    },
});

export const sendOtpEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: `"PBS Jewellers Support" <${process.env.EMAIL}>`,
            to: email,
            subject: "🔒 Secure OTP for Your Verification – PBS Jewellers",
            html: `
           <!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .email-container {
            max-width: 500px;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            text-align: left;
            margin: auto;
        }
        h2 {
            color: #4f3267;
        }
        p {
            font-size: 16px;
            color: #333;
        }
        .otp-box {
            font-size: 22px;
            font-weight: bold;
            color: #d35400;
            background: #f3f3f3;
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
            letter-spacing: 2px;
        }
        .footer {
            font-size: 13px;
            margin-top: 20px;
            color: #777;
        }
        .contact {
            font-size: 14px;
            margin-top: 10px;
        }
        a {
            color: #4f3267;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>OTP Verification – PBS Jewellers</h2>
        <p>Dear Customer,</p>
        <p>We are requesting verification of your identity for security purposes. Please use the One-Time Password (OTP) below to complete your verification:</p>
        
        <div class="otp-box">${otp}</div>

        <p>(This OTP will remain valid for 5 minutes.)</p>

        <p class="footer">
            If you did not request this OTP or believe you have received this email in error, please ignore it. 
        </p>

        <p class="contact">
            <strong>Customer Support:</strong> +91 9146455820<br>
            <strong>Website:</strong> <a href="https://www.pbsjewellers.com" target="_blank">www.pbsjewellers.com</a>
        </p>

        <p class="footer">
            <strong>Your Privacy Matters:</strong> We respect your privacy. Please review our 
            <a href="https://www.pbsjewellers.com/privacy-policy" target="_blank">Privacy Policy</a>.
        </p>

        <p><strong>Best Regards,</strong><br>PBS Jewellers Team</p>
    </div>
</body>
</html>
`
            
            
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw new Error("Failed to send OTP");
    }
};

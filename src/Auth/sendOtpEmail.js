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
                    .warning {
                        font-size: 14px;
                        color: #d9534f;
                        margin-top: 10px;
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
                    <h2>🔒 OTP Verification – PBS Jewellers</h2>
                    <p>Dear Valued Customer,</p>
                    <p>Thank you for choosing PBS Jewellers. To ensure your security, please use the One-Time Password (OTP) below to proceed with verification:</p>
                    
                    <div class="otp-box">${otp}</div>
            
                    <p>(This OTP is valid for only 5 minutes.)</p>
            
                    <p class="warning">
                        ⚠️ Important Security Notice:<br>
                        - Do <strong>not</strong> share this OTP with anyone, including PBS Jewellers staff.<br>
                        - If you did not request this OTP, please ignore this email.<br>
                        - This OTP will expire after 5 minutes.
                    </p>
            
                    <p class="contact">
                        📞 <strong>Customer Support:</strong> +91 9146455820<br>
                        🌐 <strong>Website:</strong> <a href="https://www.pbsjewellers.com" target="_blank">www.pbsjewellers.com</a>
                    </p>
            
                    <p class="footer">
                        🔐 <strong>Your Privacy Matters:</strong> We respect your privacy. Please review our 
                        <a href="https://www.pbsjewellers.com/privacy-policy" target="_blank">Privacy Policy</a>.<br>
                        Thank you for trusting PBS Jewellers!  
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

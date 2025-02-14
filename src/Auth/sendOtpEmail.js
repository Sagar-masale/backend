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
            from: `"PBS Gold Shop" <${process.env.EMAIL}>`,
            to: email,
            subject: "Your OTP for Verification – PBS Gold Shop",
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        padding: 20px;
                    }
                    .email-container {
                        max-width: 500px;
                        background: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                        margin: auto;
                        text-align: left;
                        color: #333;
                    }
                    h2 {
                        color: #4f3267;
                        margin-bottom: 10px;
                    }
                    p {
                        font-size: 14px;
                        line-height: 1.6;
                        margin: 10px 0;
                    }
                    .otp {
                        font-weight: bold;
                        color: #4f3267;
                    }
                    .footer {
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                        border-top: 1px solid #eee;
                        padding-top: 10px;
                    }
                    a {
                        color: #4f3267;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <h2>OTP Verification</h2>
                    <p>Dear Customer,</p>
                    <p>To verify your identity, please use the following OTP:</p>
                    
                    <p>Your OTP is: <span class="otp">${otp}</span></p>
        
                    <p>This OTP is valid for 5 minutes. Do not share it with anyone for security reasons.</p>
        
                    <p class="footer">
                        If you did not request this, please ignore this email. 
                        <br><br>
                        <strong>PBS Gold Shop</strong><br>
                        <a href="https://www.pbsgoldshop.com" target="_blank">www.pbsgoldshop.com</a>
                    </p>
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

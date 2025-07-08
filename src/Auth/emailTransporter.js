import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,           // e.g. pbsgoldshop@gmail.com
    pass: process.env.EMAIL_PASSWORD,  // App password from Gmail settings
  },
});

export default transporter;

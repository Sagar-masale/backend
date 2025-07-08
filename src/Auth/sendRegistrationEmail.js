import transporter from "./emailTransporter.js"; // if you've separated it
import dotenv from "dotenv";
dotenv.config();

export const sendRegistrationEmail = async (email, fullName) => {
  try {
    await transporter.sendMail({
      from: `"PBS Jewellers" <${process.env.EMAIL}>`,
      to: email,
      subject: "Welcome to PBS Jewellers – Registration Successful",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px;">
          <h2 style="color: #4f3267;">Welcome to PBS Jewellers, ${fullName.split(" ")[0]}!</h2>
          <p>Thank you for registering with <strong>PBS Jewellers</strong>.</p>
          <p>Your account has been created successfully. You can now explore our premium collection of gold jewelry.</p>
          <p>If you have any questions or need help, feel free to reach out to us.</p>
          <p style="margin-top: 30px;">Warm regards,<br/>PBS Jewellers Team</p>
          <hr/>
          <p style="font-size: 12px; color: #777;">This is a confirmation email for your registration on PBS Jewellers.</p>
        </div>
      </div>
      `,
    });
  } catch (err) {
    console.error("Error sending registration email:", err);
    // Don't throw error here, just log it so registration isn't blocked
  }
};

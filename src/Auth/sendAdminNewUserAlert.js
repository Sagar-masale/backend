import transporter from "./emailTransporter.js";

export const sendAdminNewUserAlert = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #fff;">
      <h2 style="color: #4f3267;">👤 New User Registered</h2>
      <p>A new user has successfully registered on PBS Jewellers.</p>

      <table style="margin-top: 20px; font-size: 15px;">
        <tr><td><strong>Name:</strong></td><td>${user.fullName}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${user.email}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${user.phoneNumber}</td></tr>
      </table>

      <p style="margin-top: 20px;">You can check the full user profile in the admin panel.</p>

      <footer style="font-size: 12px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
        PBS Jewellers Internal Notification – No reply needed.
      </footer>
    </div>
  `;

  await transporter.sendMail({
    from: `"PBS Jewellers" <no-reply@pbsjewellers.com>`,
    to: process.env.ADMIN_EMAIL, // 📧 Set this in .env
    subject: `👤 New User Registered – ${user.fullName}`,
    html,
  });
};

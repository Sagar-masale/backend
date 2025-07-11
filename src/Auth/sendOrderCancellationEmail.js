import transporter from "./emailTransporter.js"; // already configured SMTP transporter

export const sendOrderCancellationEmail = async (email, order, userName = "Customer") => {
  const shortId = order._id.toString().toUpperCase();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #4f3267;">Your Order Has Been Cancelled</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Your order with ID <strong>#${shortId}</strong> has been successfully cancelled.</p>
      <p>If this was a mistake or you have any concerns, feel free to contact our support team.</p>
      <p>Thank you for shopping at <strong>PBS Jewellers</strong>.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"PBS Jewellers" <no-reply@pbsjewellers.com>`,
    to: email,
    subject: `Order #${shortId} Cancelled`,
    html: htmlContent,
  });
};

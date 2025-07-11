import transporter from "./emailTransporter.js"; // already configured SMTP transporter

export const sendOrderCancellationEmail = async (email, order) => {
  const shortId = order._id.toString().slice(-5).toUpperCase();
  const product = order.orderDetails?.[0];

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #4f3267;">Your Order Has Been Cancelled</h2>
      <p>Hello,</p>
      <p>We wanted to let you know that your order <strong>#${shortId}</strong> has been successfully cancelled.</p>
      <div style="border: 1px solid #ddd; padding: 16px; margin: 16px 0;">
        <img src="${product?.ProductImages?.[0] || ""}" alt="Product Image" style="max-width: 100%; height: auto; border-radius: 8px;" />
        <p><strong>Product:</strong> ${product?.ProductName}</p>
        <p><strong>Price:</strong> ₹${product?.ProductPrice}</p>
      </div>
      <p>We hope to see you again soon. Thank you for shopping at <strong>PBS Jewellers</strong>.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"PBS Jewellers" <no-reply@pbsjewellers.com>`,
    to: email,
    subject: `Order #${shortId} Cancelled`,
    html: htmlContent,
  });
};

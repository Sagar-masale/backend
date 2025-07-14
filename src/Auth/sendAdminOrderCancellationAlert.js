import transporter from "./emailTransporter.js";
export const sendAdminOrderCancellationAlert = async (user, order) => {
  const shortId = order._id.toString().slice(-5).toUpperCase();

  const productList = order.products
    .map((item, i) => {
      const image = order.products?.[i]?.ProductImages?.[0] || "/default-image.jpg";
      const name = order.products?.[i]?.ProductName || "Product";
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">
            <img src="${image}" alt="${name}" width="60" style="border-radius: 6px;" />
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">
            <strong>${name}</strong><br/>
            Qty: ${item.orderQuantity} | Size: ${item.orderProductSize} | Weight: ${item.orderProductWeight}g<br/>
            ₹${item.price}
          </td>
        </tr>
      `;
    })
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #fff;">
      <h2 style="color: #d32f2f;">⚠️ Order Cancelled – #${shortId}</h2>

      <p><strong>User:</strong> ${user.fullName || "N/A"}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phoneNumber || "N/A"}</p>

      <p style="margin-top: 20px;">The user has cancelled the following order:</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        ${productList}
      </table>

      <p style="margin-top: 20px;"><strong>Total:</strong> ₹${order.totalAmountWithDiscount || order.totalAmount}</p>

      <footer style="font-size: 12px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
        PBS Jewellers Internal Notification – No reply needed.
      </footer>
    </div>
  `;

  await transporter.sendMail({
    from: `"PBS Jewellers Alert" <no-reply@pbsjewellers.com>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Order Cancelled – #${shortId} by ${user.fullName || "User"}`,
    html,
  });
};

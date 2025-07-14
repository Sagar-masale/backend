import transporter from "./emailTransporter.js";
export const sendAdminOrderAlertEmail = async (user, order) => {
  const shortId = order._id.toString().slice(-5).toUpperCase();

  const productList = order.products
    .map((item, i) => {
      const image = order.products?.[i]?.ProductImages?.[0] || "/default-image.jpg";
      const name = order.products?.[i]?.ProductName || "Product";

      return `
        <tr style="margin-bottom: 20px;">
          <td style="padding-right: 15px;">
            <img src="${image}" alt="Product" width="80" height="80" style="border-radius: 8px;" />
          </td>
          <td style="font-size: 14px; color: #333;">
            <strong>${name}</strong><br/>
            Qty: ${item.orderQuantity} | Size: ${item.orderProductSize} | Weight: ${item.orderProductWeight}g<br/>
            Price: ₹${item.price}
          </td>
        </tr>
      `;
    })
    .join("");

  const descountSection = order.discount
    ? `<p><strong>Discount:</strong> ₹${order.discount}</p>`
    : "";

  const coupon = order.products.find((p) => p.ProductCouponCode);

  const couponSection = coupon
    ? `<p><strong>Coupon Used:</strong> #${coupon.ProductCouponCode}</p>`
    : "";

  const amountSection = order.totalAmountWithDiscount
    ? `<p><strong>Total:</strong> ₹${order.totalAmountWithDiscount} (Original: ₹${order.totalAmount})</p>`
    : `<p><strong>Total:</strong> ₹${order.totalAmount}</p>`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #fff;">
      <h2 style="color: #4f3267;">🛒 New Order Alert – #${shortId}</h2>

      <h3 style="margin-top: 20px;">🧑‍💼 Customer Info</h3>
      <p><strong>Name:</strong> ${user.fullName || "N/A"}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phoneNumber || "N/A"}</p>
      <p><strong>Address:</strong> ${user.addressLine1 || user.addressLine2 || "NA"}</p>

      ${descountSection}
      ${couponSection}

      <h3 style="margin-top: 20px;">📦 Products Ordered</h3>
      <table style="width: 100%; margin-top: 10px;">
        ${productList}
      </table>

      ${amountSection}

      <footer style="font-size: 12px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
        PBS Jewellers Internal Alert – Do not reply<br/>
      </footer>
    </div>
  `;

  await transporter.sendMail({
    from: `"PBS Jewellers" <${process.env.EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🛎️ New Order Received - #${shortId}`,
    html,
  });
};

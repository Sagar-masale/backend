import dotenv from "dotenv";
import transporter from "./emailTransporter.js";
dotenv.config();

export const sendOrderConfirmationEmail = async (email, order) => {
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
    ? `
      <p style="margin: 10px 0;">
        <strong>Discount Applied:</strong> 
        <span style="color: #4f3267;">${order.discount}</span><br/>
      </p>
    `
    : "";

const firstCouponProduct = order.products.find((p) => p.ProductCouponCode);

const couponSection = firstCouponProduct
  ? `
    <p style="margin: 10px 0;">
      <strong>Coupon Applied:</strong> 
      <span style="color: #4f3267;">${'#'+firstCouponProduct.ProductCouponCode}</span><br/>
      Please present this code at pickup.
    </p>
  `
  : "";



  const amountSection = order.totalAmountWithDiscount
    ? `
      <p style="margin-top: 20px; font-size: 16px;">
        <strong>Total Amount:</strong> <span style="text-decoration: line-through; color: #888;">₹${order.totalAmount}</span>
        &nbsp;→ <span style="color: #4f3267;">₹${order.totalAmountWithDiscount}</span>
      </p>
    `
    : `
      <p style="margin-top: 20px; font-size: 16px;">
        <strong>Total Amount:</strong> ₹${order.totalAmount}
      </p>
    `;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f9f7fc; color: #333;">
      <h2 style="color: #4f3267;">Order Confirmed!</h2>
      <p>Your order <strong>#${shortId}</strong> has been placed successfully with PBS Gold Shop.</p>

      <p><strong>Note:</strong> This order is for <span style="color:#4f3267;">in-store pickup only</span>. Once your items are ready, you will receive a notification to pick them up from the store.</p>

      ${descountSection}

      ${couponSection}

      <table style="width: 100%; margin-top: 20px;">
        ${productList}
      </table>

      ${amountSection}

      <p style="margin-top: 30px;">We appreciate your trust in PBS Gold Shop. We’ll notify you once your order is ready for pickup.</p>

      <footer style="font-size: 12px; color: #888; margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px;">
        PBS Gold Shop<br/>
        <a href="https://pbsjewellers.vercel.app" target="_blank">www.pbsjewellers.com</a>
      </footer>
    </div>
  `;

  await transporter.sendMail({
    from: `"PBS Jewellers" <${process.env.EMAIL}>`,
    to: email,
    subject: "Order Confirmed – Ready for Pickup Soon",
    html,
  });
};

import transporter from "./emailTransporter.js";

export const sendProductEmail = async (req, res) => {
  const {
    subject,
    productName,
    productDescription,
    productUrl,
    emails,
    ProductImage,
  } = req.body;

  const emailHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Product Launch</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f3f9; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background-color: #4f3267; color: #ffffff; text-align: center; padding: 20px;">
          <h2 style="margin: 0;">New Product from PBS Jewellers</h2>
        </div>
        <div style="padding: 20px; text-align: center;">
          <h3 style="color: #4f3267; margin-bottom: 10px;">${productName}</h3>

          ${
            ProductImage
              ? `<img src="${ProductImage}" alt="${productName}" style="width: 100%; max-width: 150px; height: auto; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); margin-bottom: 20px;" />`
              : ""
          }

          <p style="color: #333; font-size: 15px; line-height: 1.6;">${productDescription}</p>

          <a href="${productUrl}" target="_blank" style="display: inline-block; margin-top: 20px; padding: 12px 28px; background-color: #4f3267; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
            View Product
          </a>
        </div>

          <div style="background-color: #f1ebf7; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            You're receiving this because you're a valued customer of PBS Jewellers.
          </div>
      </div>
    </body>
  </html>
  `;

  try {
    const promises = emails.map((email) =>
      transporter.sendMail({
        from: '"PBS Jewellers" <pbsalegaon@gmail.com>',
        to: email,
        subject,
        html: emailHtml,
      })
    );

    await Promise.all(promises);
    res.status(200).json({ message: "Emails sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send emails", details: err.message });
  }
};

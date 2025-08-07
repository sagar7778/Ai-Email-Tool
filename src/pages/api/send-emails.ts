import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import nodemailer from "nodemailer";

type Client = {
  Name: string;
  Email: string;
  Company: string;
};

type ResponseData = {
  message: string;
};

const handler = nextConnect<NextApiRequest, NextApiResponse<ResponseData>>({
  onError(error, req, res) {
    console.error("❌ API error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: "Method Not Allowed" });
  },
});

handler.post(async (req, res) => {
  const clients: Client[] = req.body.clients;

  if (!clients || !Array.isArray(clients)) {
    return res.status(400).json({ message: "Invalid clients data" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  try {
    for (const client of clients) {
      const mailOptions = {
        from: `"Sagar Koshti 👨‍💻" <${process.env.EMAIL}>`,
        to: client.Email,
        subject: `🚀 Let's Build Something Amazing for ${client.Company}`,
        html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 0; margin: 0; background-color: #f4f8fb;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0;">
      <div style="background-color: #2a7ae4; color: white; padding: 24px 30px;">
        <h2 style="margin: 0; font-size: 24px;">Hi ${client.Name}, 👋</h2>
        <p style="margin: 5px 0 0; font-size: 16px;">Let's build something amazing for <strong>${client.Company}</strong></p>
      </div>
      <div style="padding: 30px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6;">
          I'm <strong style="color: #2a7ae4;">Sagar Koshti</strong>, a developer who specializes in creating stunning websites and powerful software to grow your business.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Whether you need a website, mobile app, or a custom tool — I deliver great results at prices that respect your budget. 💰
        </p>
        <div style="background-color: #f0f6ff; padding: 20px 24px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 16px;">Why choose me?</p>
          <ul style="padding-left: 20px; margin: 0; font-size: 15px; color: #333;">
            <li>🚀 <strong style="color: #2a7ae4;">Fast Delivery</strong> – Quick turnaround without compromise</li>
            <li>💸 <strong style="color: #28a745;">Budget Friendly</strong> – Customized to fit your finances</li>
            <li>✅ <strong style="color: #ff9900;">Reliable Support</strong> – Clear communication & post-launch help</li>
          </ul>
        </div>
        <p style="font-size: 16px; line-height: 1.6;">
          Ready to take the next step? Just reply to this email or reach out through the contact details below.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">Looking forward to working with you!</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
          Best regards,<br />
          <strong style="font-size: 18px; color: #000;">Sagar Koshti</strong><br />
          Web & Software Developer<br />
          📞 <a href="tel:+919409307167" style="color: #2a7ae4; text-decoration: none;">+91-9409307167</a><br />
          📧 <a href="mailto:sagarkoshti6531@gmail.com" style="color: #2a7ae4; text-decoration: none;">sagarkoshti6531@gmail.com</a>
        </p>
      </div>
    </div>
  </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: "Emails sent" });
  } catch (err: any) {
    console.error("❌ Email error:", err.message);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

export default handler;
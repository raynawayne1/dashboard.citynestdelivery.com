import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { htmlToText } from "html-to-text";
// ✅ Using the Admin DB instance to bypass Security Rules
import { db as adminDb } from "../../../lib/firebaseAdmin"; 

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(req: Request) {
  const startTime = Date.now();
  let recipientEmail = "Unknown";
  
  try {
    const body = await req.json();
    const { to, subject, html } = body;
    recipientEmail = to;

    console.log(`[EMAIL API] 📨 New request received for: ${to}`);

    if (!to || !subject || !html) {
      console.warn("[EMAIL API] ⚠️ Missing required fields:", { to, subject, hasHtml: !!html });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ FIXED: Using Admin SDK syntax to check Firestore
    console.log(`[EMAIL API] 🔍 Checking unsubscribe status for: ${to}...`);
    const unsubRef = adminDb.collection("unsubscribed_emails").doc(to);
    const unsubSnap = await unsubRef.get();

    if (unsubSnap.exists) {
      console.log(`[EMAIL API] 🛑 User ${to} has unsubscribed. Aborting send.`);
      return NextResponse.json(
        { message: "User has unsubscribed. Email not sent." },
        { status: 200 }
      );
    }

    console.log("[EMAIL API] ✅ User is subscribed. Preparing template...");

    const unsubscribeUrl = `https://abrrypartners.com/api/unsubscribe?email=${encodeURIComponent(to)}`;

    const htmlWithButton = `
      ${html}
      <hr style="margin-top:30px;margin-bottom:20px; border: 0; border-top: 1px solid #eee;" />
      <div style="text-align:center;margin-top:15px; font-family: sans-serif;">
        <p style="color: #666; font-size: 12px;">You received this because you are a member of Citynestdelivery.</p>
        <a href="${unsubscribeUrl}" 
           style="display:inline-block;padding:8px 15px;margin:5px;background:#ff4d4f;color:white;text-decoration:none;border-radius:5px;font-size:13px;font-weight:bold;">
           Unsubscribe from these emails
        </a>
      </div>
    `;

    const text = htmlToText(htmlWithButton, {
      wordwrap: 120,
      selectors: [
        { selector: "img", format: "skip" },
        { selector: "a", options: { hideLinkHrefIfSameAsText: false } },
      ],
    });

    const mailOptions = {
      from: `"Citynestdelivery" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: htmlWithButton,
      replyTo: "support@abrrypartners.com",
      headers: {
        "X-Mailer": "Citynestdelivery Mailer",
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    };

    console.log(`[EMAIL API] 📤 Attempting to send via ${process.env.EMAIL_HOST}...`);

    const info = await transporter.sendMail(mailOptions);

    const duration = Date.now() - startTime;
    console.log(`[EMAIL API] ✨ Success! MessageId: ${info.messageId} (${duration}ms)`);

    return NextResponse.json(
      { message: "Email sent successfully", messageId: info.messageId },
      { status: 200 }
    );

  } catch (error) {
    const err = error as Error;
    console.error("[EMAIL API] ❌ CRITICAL ERROR:", {
      message: err.message,
      to: recipientEmail,
      time: new Date().toISOString()
    });

    return NextResponse.json(
      {
        message: "Error sending email",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
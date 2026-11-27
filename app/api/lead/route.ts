import { NextResponse, after } from "next/server";
import nodemailer from "nodemailer";

interface LeadPayload {
  fullName: string;
  mobileNumber: string;
  email?: string;
  qualification: string;
  enquiryType: string;
  courseName?: string;
  courseFee?: string;
  trainingMode?: string;
  source?: string;
  utmParameters?: Record<string, string>;
  pageUrl?: string;
  submittedAt?: string;
}

export async function POST(request: Request) {
  try {
    const body: LeadPayload = await request.json();

    const {
      fullName,
      mobileNumber,
      email = "",
      qualification,
      enquiryType,
      courseName = "Automation Testing + Free Manual Testing",
      courseFee = "₹19,000 (Regular: ₹59,000)",
      trainingMode = "100% Online",
      source = "Meta Ads",
      utmParameters = {},
      pageUrl = "",
      submittedAt = new Date().toISOString(),
    } = body;

    // 1. Instant Validation (<1ms)
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const cleanPhone = mobileNumber ? mobileNumber.replace(/\D/g, "") : "";
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    if (!qualification || qualification.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Please select your highest qualification." },
        { status: 400 }
      );
    }

    const leadData = {
      fullName: fullName.trim(),
      mobileNumber: cleanPhone,
      email: email ? email.trim().toLowerCase() : "",
      qualification: qualification.trim(),
      enquiryType: enquiryType || "Book Free Demo Class",
      courseName,
      courseFee,
      trainingMode,
      source,
      utmParameters,
      pageUrl,
      submittedAt,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    };

    // 2. Schedule Background Deliveries (Email & Google Sheets) non-blockingly using Next.js after()
    // This allows the response to return to the client browser in ~30ms, making form submission instant!
    after(async () => {
      const backgroundTasks: Promise<unknown>[] = [];

      // Task A: SMTP Email with App Password
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
      const smtpSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : smtpPort === 465;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS; // 16-character App Password

      const emailFrom = process.env.EMAIL_FROM || `"Shloka Global Admissions" <${smtpUser}>`;
      const emailTo = process.env.EMAIL_TO || smtpUser;
      const emailCc = process.env.EMAIL_CC ? process.env.EMAIL_CC.split(",").map((e) => e.trim()).filter(Boolean) : undefined;
      const emailBcc = process.env.EMAIL_BCC ? process.env.EMAIL_BCC.split(",").map((e) => e.trim()).filter(Boolean) : undefined;

      if (smtpUser && smtpPass && emailTo) {
        const sendEmailTask = (async () => {
          try {
            const transporter = nodemailer.createTransport({
              host: smtpHost,
              port: smtpPort,
              secure: smtpSecure,
              auth: {
                user: smtpUser,
                pass: smtpPass,
              },
            });

            const utmFormatted = Object.entries(utmParameters)
              .map(([k, v]) => `<strong>${k}:</strong> ${v}`)
              .join(" | ");

            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>New Lead Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 24px; color: #10294b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(16,41,75,0.08); border: 1px solid #e2e8f0;">
    <div style="background: #10294b; padding: 24px 28px; text-align: center; border-bottom: 4px solid #f5bd3f;">
      <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">
        Shloka Global Education
      </h1>
      <p style="color: #f5bd3f; margin: 6px 0 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
        🎓 New Student Enquiry Received
      </p>
    </div>

    <div style="padding: 28px;">
      <div style="background: #f8fafc; border-left: 4px solid #10294b; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px;">
        <span style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Enquiry Type:</span>
        <strong style="font-size: 14px; color: #10294b; display: block; margin-top: 2px;">${leadData.enquiryType}</strong>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 38%; font-weight: 600;">Student Name:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0d2342; font-weight: 700;">${leadData.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">Mobile Number:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0d2342; font-weight: 700;">
            <a href="tel:+91${leadData.mobileNumber}" style="color: #10294b; text-decoration: none;">+91 ${leadData.mobileNumber}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">Email ID:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0d2342; font-weight: 600;">
            ${leadData.email ? `<a href="mailto:${leadData.email}" style="color: #10294b; text-decoration: none;">${leadData.email}</a>` : "Not provided"}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">Qualification:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0d2342; font-weight: 600;">${leadData.qualification}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">Program:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0d2342; font-weight: 600;">${leadData.courseName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">Course Fee:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0d2342; font-weight: 700;">
            ${leadData.courseFee} <span style="background: #ecfdf5; color: #059669; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Free Manual Add-On</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">Training Mode:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0d2342; font-weight: 600;">${leadData.trainingMode}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">Submitted Time:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0d2342; font-size: 13px;">${leadData.timestamp}</td>
        </tr>
        ${
          utmFormatted
            ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">UTM Tracking:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #0d2342; font-size: 12px;">${utmFormatted}</td>
        </tr>
        `
            : ""
        }
      </table>

      <div style="margin-top: 24px; text-align: center;">
        <a href="tel:+91${leadData.mobileNumber}" style="display: inline-block; background: #10294b; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; margin: 4px;">
          📞 Call Candidate
        </a>
        <a href="https://wa.me/91${leadData.mobileNumber}?text=Hi%20${encodeURIComponent(leadData.fullName)},%20thank%20you%20for%20enquiring%20about%20the%20Software%20Testing%20Course%20at%20Shloka%20Global%20Education!" style="display: inline-block; background: #25d366; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; margin: 4px;">
          💬 WhatsApp
        </a>
        ${leadData.email ? `
        <a href="mailto:${leadData.email}" style="display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; margin: 4px;">
          ✉️ Email
        </a>` : ""}
      </div>
    </div>

    <div style="background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
      Shloka Global Education • Kukatpally, Hyderabad • www.shlokaglobaleducation.com
    </div>
  </div>
</body>
</html>
`;

            await transporter.sendMail({
              from: emailFrom,
              to: emailTo,
              cc: emailCc && emailCc.length > 0 ? emailCc : undefined,
              bcc: emailBcc && emailBcc.length > 0 ? emailBcc : undefined,
              subject: `🎓 New Lead: ${leadData.fullName} (${leadData.qualification}) - Shloka Global Education`,
              html: htmlContent,
              text: `New Lead: ${leadData.fullName}\nPhone: ${leadData.mobileNumber}\nEmail: ${leadData.email || "N/A"}\nQualification: ${leadData.qualification}\nEnquiry Type: ${leadData.enquiryType}\nProgram: ${leadData.courseName}\nSubmitted: ${leadData.timestamp}`,
            });
          } catch (err) {
            console.error("Async Email Sending Error:", err);
          }
        })();
        backgroundTasks.push(sendEmailTask);
      }

      // Task B: Google Sheets Webhook
      const googleSheetWebhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
      if (googleSheetWebhook && googleSheetWebhook.trim() !== "") {
        const sendSheetTask = (async () => {
          try {
            await fetch(googleSheetWebhook, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(leadData),
            });
          } catch (sheetErr) {
            console.error("Async Google Sheet Error:", sheetErr);
          }
        })();
        backgroundTasks.push(sendSheetTask);
      }

      // Task C: Secondary Webhook (e.g. GoHighLevel)
      const externalWebhook = process.env.LEAD_WEBHOOK_URL || process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;
      if (externalWebhook && externalWebhook.trim() !== "") {
        const sendExtTask = (async () => {
          try {
            await fetch(externalWebhook, {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify(leadData),
            });
          } catch (extErr) {
            console.error("Async External Webhook Error:", extErr);
          }
        })();
        backgroundTasks.push(sendExtTask);
      }

      // Execute all background tasks concurrently
      if (backgroundTasks.length > 0) {
        await Promise.allSettled(backgroundTasks);
      }
    });

    // 3. Instant Return (<50ms) to trigger immediate client redirection
    return NextResponse.json({
      success: true,
      message: "Lead recorded successfully.",
    });
  } catch (error: unknown) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error occurred.",
      },
      { status: 500 }
    );
  }
}

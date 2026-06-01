import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST?.replace(/"/g, "") ?? "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT ?? "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM = `Pranta Das <${process.env.SMTP_USER}>`;
const OWNER_EMAIL = process.env.SMTP_USER as string;
const SITE = "https://prantadas.vercel.app";

// ── Notification email sent to Pranta ────────────────────────────────────────
export function buildNotificationHtml(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New Contact Message</title></head>
<body style="margin:0;padding:0;background:#060810;font-family:'Inter',Arial,sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060810;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0d1117,#0a0f1e);border:1px solid rgba(255,255,255,0.06);border-radius:16px 16px 0 0;padding:32px 36px;text-align:center;">
          <div style="display:inline-block;width:48px;height:48px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.2);border-radius:12px;line-height:48px;font-size:22px;margin-bottom:16px;">📬</div>
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;">New Portfolio Message</h1>
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);font-family:monospace;">Someone reached out via prantadas.vercel.app</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#0d1117;border:1px solid rgba(255,255,255,0.06);border-top:0;padding:32px 36px;">

          <!-- Sender info -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td width="50%" style="padding-right:8px;">
                <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;">
                  <div style="font-size:10px;color:rgba(0,212,255,0.6);font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">From</div>
                  <div style="font-size:14px;color:#e2e8f0;font-weight:600;">${data.name}</div>
                </div>
              </td>
              <td width="50%" style="padding-left:8px;">
                <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;">
                  <div style="font-size:10px;color:rgba(0,212,255,0.6);font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Email</div>
                  <div style="font-size:14px;color:#00d4ff;">${data.email}</div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Subject -->
          <div style="margin-bottom:20px;">
            <div style="font-size:10px;color:rgba(0,212,255,0.6);font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Subject</div>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;font-size:15px;font-weight:600;color:#ffffff;">${data.subject}</div>
          </div>

          <!-- Message -->
          <div style="margin-bottom:28px;">
            <div style="font-size:10px;color:rgba(0,212,255,0.6);font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Message</div>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:18px 16px;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.7;white-space:pre-wrap;">${data.message}</div>
          </div>

          <!-- Reply CTA -->
          <div style="text-align:center;">
            <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" style="display:inline-block;background:#00d4ff;color:#060810;font-size:14px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;">Reply to ${data.name}</a>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#060810;border:1px solid rgba(255,255,255,0.06);border-top:0;border-radius:0 0 16px 16px;padding:20px 36px;text-align:center;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);font-family:monospace;">Received from <a href="${SITE}" style="color:rgba(0,212,255,0.5);text-decoration:none;">${SITE}</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Auto-reply sent to the sender ─────────────────────────────────────────────
export function buildAutoReplyHtml(name: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Message Received</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',Arial,sans-serif;color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header with gradient -->
        <tr><td style="background:linear-gradient(135deg,#060810 0%,#0a1628 100%);border-radius:16px 16px 0 0;padding:40px 36px;text-align:center;">
          <div style="width:64px;height:64px;background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.25);border-radius:16px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:28px;line-height:64px;">👋</div>
          <h1 style="margin:0 0 10px;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Message Received!</h1>
          <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.5);">I'll get back to you within 24–48 hours.</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
          <p style="margin:0 0 20px;font-size:16px;color:#334155;line-height:1.6;">Hi <strong style="color:#0f172a;">${name}</strong>,</p>
          <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.7;">
            Thanks for reaching out through my portfolio! I've received your message and will review it shortly.
          </p>
          <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.7;">
            I typically respond within <strong style="color:#0f172a;">24–48 hours</strong> on business days. If your matter is urgent, feel free to reach out directly via email or LinkedIn.
          </p>

          <!-- Divider -->
          <div style="height:1px;background:#f1f5f9;margin-bottom:28px;"></div>

          <!-- Contact cards -->
          <p style="margin:0 0 16px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;font-family:monospace;">Other ways to reach me</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="33%" style="padding-right:6px;vertical-align:top;">
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;text-align:center;">
                  <div style="font-size:20px;margin-bottom:6px;">📧</div>
                  <div style="font-size:11px;color:#94a3b8;font-family:monospace;margin-bottom:4px;">Email</div>
                  <a href="mailto:prantodas043@gmail.com" style="font-size:11px;color:#0ea5e9;text-decoration:none;word-break:break-all;">prantodas043@gmail.com</a>
                </div>
              </td>
              <td width="33%" style="padding:0 3px;vertical-align:top;">
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;text-align:center;">
                  <div style="font-size:20px;margin-bottom:6px;">💼</div>
                  <div style="font-size:11px;color:#94a3b8;font-family:monospace;margin-bottom:4px;">LinkedIn</div>
                  <a href="https://linkedin.com/in/pranta-das7" style="font-size:11px;color:#0ea5e9;text-decoration:none;">pranta-das7</a>
                </div>
              </td>
              <td width="33%" style="padding-left:6px;vertical-align:top;">
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;text-align:center;">
                  <div style="font-size:20px;margin-bottom:6px;">🐙</div>
                  <div style="font-size:11px;color:#94a3b8;font-family:monospace;margin-bottom:4px;">GitHub</div>
                  <a href="https://github.com/Prantadas" style="font-size:11px;color:#0ea5e9;text-decoration:none;">Prantadas</a>
                </div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 16px 16px;padding:24px 36px;text-align:center;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#334155;">Pranta Das</p>
          <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;">Backend Developer & Team Lead · Dhaka, Bangladesh</p>
          <a href="${SITE}" style="font-size:12px;color:#0ea5e9;text-decoration:none;">${SITE}</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Send both emails ──────────────────────────────────────────────────────────
export async function sendContactEmails(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await Promise.all([
    // Notification to Pranta
    transporter.sendMail({
      from: FROM,
      to: OWNER_EMAIL,
      replyTo: data.email,
      subject: `[Portfolio] ${data.subject}`,
      html: buildNotificationHtml(data),
    }),
    // Auto-reply to sender
    transporter.sendMail({
      from: FROM,
      to: data.email,
      subject: `Got your message, ${data.name}! — Pranta Das`,
      html: buildAutoReplyHtml(data.name),
    }),
  ]);
}

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

function timestamp() {
  return new Date().toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: "Asia/Dhaka",
  });
}

// ── Notification email sent to Pranta ─────────────────────────────────────────
export function buildNotificationHtml(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const ts = timestamp();
  const preview = data.message.length > 120 ? data.message.slice(0, 120) + "…" : data.message;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>[Portfolio] ${data.subject}</title>
</head>
<body style="margin:0;padding:0;background:#060810;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#e2e8f0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#060810;min-height:100vh;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Header bar -->
      <tr><td style="background:linear-gradient(135deg,#0d1117 0%,#0a0f1e 100%);border:1px solid rgba(255,255,255,0.07);border-bottom:0;border-radius:16px 16px 0 0;padding:28px 36px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:44px;height:44px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.2);border-radius:11px;text-align:center;vertical-align:middle;">
                    <span style="font-family:monospace;font-size:14px;font-weight:700;color:#00d4ff;line-height:44px;">PD</span>
                  </td>
                  <td style="padding-left:14px;">
                    <div style="font-size:15px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Pranta Das</div>
                    <div style="font-size:11px;color:rgba(0,212,255,0.6);font-family:monospace;margin-top:2px;">portfolio notification</div>
                  </td>
                </tr>
              </table>
            </td>
            <td align="right">
              <div style="display:inline-block;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.15);border-radius:20px;padding:5px 12px;">
                <span style="font-size:11px;font-family:monospace;color:rgba(0,212,255,0.7);">NEW MESSAGE</span>
              </div>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Accent line -->
      <tr><td style="height:2px;background:linear-gradient(90deg,#00d4ff,rgba(139,92,246,0.6),transparent);border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);"></td></tr>

      <!-- Body -->
      <tr><td style="background:#0d1117;border:1px solid rgba(255,255,255,0.07);border-top:0;border-bottom:0;padding:32px 36px;">

        <!-- Meta row -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td width="48%" style="padding-right:8px;">
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px 16px;">
                <div style="font-size:9px;font-family:monospace;color:rgba(0,212,255,0.55);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:7px;">From</div>
                <div style="font-size:14px;font-weight:600;color:#f1f5f9;">${data.name}</div>
              </div>
            </td>
            <td width="52%" style="padding-left:8px;">
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px 16px;">
                <div style="font-size:9px;font-family:monospace;color:rgba(0,212,255,0.55);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:7px;">Email</div>
                <a href="mailto:${data.email}" style="font-size:13px;color:#00d4ff;text-decoration:none;word-break:break-all;">${data.email}</a>
              </div>
            </td>
          </tr>
        </table>

        <!-- Subject -->
        <div style="margin-bottom:20px;">
          <div style="font-size:9px;font-family:monospace;color:rgba(0,212,255,0.55);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;">Subject</div>
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px 16px;font-size:15px;font-weight:600;color:#ffffff;">${data.subject}</div>
        </div>

        <!-- Message -->
        <div style="margin-bottom:28px;">
          <div style="font-size:9px;font-family:monospace;color:rgba(0,212,255,0.55);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;">Message</div>
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-left:3px solid rgba(0,212,255,0.35);border-radius:0 10px 10px 0;padding:18px 18px;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.75;white-space:pre-wrap;">${data.message}</div>
        </div>

        <!-- Timestamp -->
        <div style="margin-bottom:28px;text-align:right;">
          <span style="font-size:11px;font-family:monospace;color:rgba(255,255,255,0.25);">Received: ${ts}</span>
        </div>

        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <a href="mailto:${data.email}?subject=Re%3A%20${encodeURIComponent(data.subject)}&body=Hi%20${encodeURIComponent(data.name)}%2C%0A%0A"
                 style="display:inline-block;background:#00d4ff;color:#060810;font-size:14px;font-weight:700;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:-0.2px;">
                Reply to ${data.name} →
              </a>
            </td>
          </tr>
        </table>

      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#060810;border:1px solid rgba(255,255,255,0.07);border-top:0;border-radius:0 0 16px 16px;padding:18px 36px;text-align:center;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);font-family:monospace;">
          via <a href="${SITE}" style="color:rgba(0,212,255,0.45);text-decoration:none;">${SITE}</a>
          &nbsp;·&nbsp; contact form
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ── Auto-reply sent to the contact ────────────────────────────────────────────
export function buildAutoReplyHtml(
  name: string,
  subject: string,
  message: string,
) {
  const previewText = message.length > 160 ? message.slice(0, 160) + "…" : message;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Got your message — Pranta Das</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#060810;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#060810;min-height:100vh;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- ═══ HEADER ═══ -->
  <tr><td style="background:linear-gradient(160deg,#0a0f1e 0%,#0d1117 60%,#0a0a14 100%);border:1px solid rgba(255,255,255,0.07);border-bottom:0;border-radius:16px 16px 0 0;padding:40px 36px 36px;text-align:center;">

    <!-- Brand monogram -->
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 22px;">
      <tr>
        <td style="width:60px;height:60px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.22);border-radius:16px;text-align:center;vertical-align:middle;">
          <span style="font-family:monospace;font-size:18px;font-weight:800;color:#00d4ff;letter-spacing:-1px;">PD</span>
        </td>
      </tr>
    </table>

    <!-- Check badge -->
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
      <tr>
        <td style="background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.25);border-radius:20px;padding:6px 16px;">
          <span style="font-size:12px;font-family:monospace;color:#34d399;letter-spacing:0.08em;">✓ MESSAGE RECEIVED</span>
        </td>
      </tr>
    </table>

    <h1 style="margin:0 0 10px;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.6px;line-height:1.2;">
      Thanks, ${name}!
    </h1>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.45);line-height:1.6;max-width:400px;margin:0 auto;">
      I've received your message and will get back to you personally.
    </p>
  </td></tr>

  <!-- Accent line -->
  <tr><td style="height:2px;background:linear-gradient(90deg,transparent,#00d4ff,rgba(139,92,246,0.8),transparent);border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);"></td></tr>

  <!-- ═══ BODY ═══ -->
  <tr><td style="background:#0d1117;border:1px solid rgba(255,255,255,0.07);border-top:0;border-bottom:0;padding:36px;">

    <!-- Greeting -->
    <p style="margin:0 0 20px;font-size:16px;color:rgba(255,255,255,0.8);line-height:1.6;">
      Hi <strong style="color:#ffffff;">${name}</strong>,
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.5);line-height:1.75;">
      Your message has landed in my inbox. I personally read every message I receive and will craft a thoughtful reply — not a template.
    </p>

    <!-- Message preview block -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-left:3px solid rgba(0,212,255,0.4);border-radius:0 10px 10px 0;padding:18px 20px;">
          <div style="font-size:9px;font-family:monospace;color:rgba(0,212,255,0.55);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;">Your message</div>
          <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.75);margin-bottom:8px;">${subject}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.4);line-height:1.65;font-style:italic;">"${previewText}"</div>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="height:1px;background:linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));"></td>
      </tr>
    </table>

    <!-- What happens next -->
    <div style="margin-bottom:10px;font-size:9px;font-family:monospace;color:rgba(0,212,255,0.55);text-transform:uppercase;letter-spacing:0.12em;">What happens next</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">

      <!-- Step 1 -->
      <tr>
        <td width="36" style="vertical-align:top;padding-top:2px;">
          <div style="width:28px;height:28px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.18);border-radius:8px;text-align:center;line-height:28px;font-size:11px;font-family:monospace;font-weight:700;color:#00d4ff;">1</div>
        </td>
        <td style="padding-left:12px;padding-bottom:16px;">
          <div style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.8);margin-bottom:3px;">I read your message</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.38);line-height:1.5;">I review each message personally — no bots, no filters.</div>
        </td>
      </tr>

      <!-- Step 2 -->
      <tr>
        <td width="36" style="vertical-align:top;padding-top:2px;">
          <div style="width:28px;height:28px;background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.18);border-radius:8px;text-align:center;line-height:28px;font-size:11px;font-family:monospace;font-weight:700;color:#a78bfa;">2</div>
        </td>
        <td style="padding-left:12px;padding-bottom:16px;">
          <div style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.8);margin-bottom:3px;">I prepare a thoughtful reply</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.38);line-height:1.5;">I'll research, think it through, and give you a real answer.</div>
        </td>
      </tr>

      <!-- Step 3 -->
      <tr>
        <td width="36" style="vertical-align:top;padding-top:2px;">
          <div style="width:28px;height:28px;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.18);border-radius:8px;text-align:center;line-height:28px;font-size:11px;font-family:monospace;font-weight:700;color:#34d399;">3</div>
        </td>
        <td style="padding-left:12px;">
          <div style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.8);margin-bottom:3px;">You hear back within 24 hours</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.38);line-height:1.5;">Usually same day. Weekends may take a little longer.</div>
        </td>
      </tr>

    </table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="height:1px;background:linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));"></td>
      </tr>
    </table>

    <!-- Alternative contact -->
    <div style="margin-bottom:12px;font-size:9px;font-family:monospace;color:rgba(0,212,255,0.55);text-transform:uppercase;letter-spacing:0.12em;">Need to reach me faster?</div>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="48%" style="padding-right:8px;">
          <a href="mailto:prantodas043@gmail.com" style="display:block;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:13px 14px;text-decoration:none;">
            <div style="font-size:9px;font-family:monospace;color:rgba(0,212,255,0.55);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px;">Direct email</div>
            <div style="font-size:12px;color:#00d4ff;word-break:break-all;">prantodas043@gmail.com</div>
          </a>
        </td>
        <td width="52%" style="padding-left:8px;">
          <a href="https://linkedin.com/in/pranta-das7" style="display:block;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:13px 14px;text-decoration:none;">
            <div style="font-size:9px;font-family:monospace;color:rgba(0,212,255,0.55);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px;">LinkedIn</div>
            <div style="font-size:12px;color:#00d4ff;">linkedin.com/in/pranta-das7</div>
          </a>
        </td>
      </tr>
    </table>

  </td></tr>

  <!-- ═══ FOOTER ═══ -->
  <tr><td style="background:#060810;border:1px solid rgba(255,255,255,0.07);border-top:0;border-radius:0 0 16px 16px;padding:24px 36px;">

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <div style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.65);margin-bottom:3px;">Pranta Das</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.28);margin-bottom:10px;">Backend Developer &amp; Team Lead &nbsp;·&nbsp; Dhaka, Bangladesh</div>
          <!-- Social links -->
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:12px;">
                <a href="${SITE}" style="font-size:11px;font-family:monospace;color:rgba(0,212,255,0.5);text-decoration:none;">Portfolio</a>
              </td>
              <td style="padding-right:12px;">
                <a href="https://github.com/Prantadas" style="font-size:11px;font-family:monospace;color:rgba(255,255,255,0.3);text-decoration:none;">GitHub</a>
              </td>
              <td>
                <a href="https://linkedin.com/in/pranta-das7" style="font-size:11px;font-family:monospace;color:rgba(255,255,255,0.3);text-decoration:none;">LinkedIn</a>
              </td>
            </tr>
          </table>
        </td>
        <td align="right" style="vertical-align:bottom;">
          <a href="${SITE}" style="display:inline-block;width:38px;height:38px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.15);border-radius:10px;text-align:center;line-height:38px;text-decoration:none;">
            <span style="font-family:monospace;font-size:12px;font-weight:800;color:#00d4ff;">PD</span>
          </a>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.05);">
      <tr>
        <td>
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.18);line-height:1.6;">
            You're receiving this because you submitted the contact form at
            <a href="${SITE}" style="color:rgba(0,212,255,0.4);text-decoration:none;">${SITE}</a>.
            This is an automated confirmation — please don't reply to this email.
          </p>
        </td>
      </tr>
    </table>

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
      html: buildAutoReplyHtml(data.name, data.subject, data.message),
    }),
  ]);
}

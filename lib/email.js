import nodemailer from 'nodemailer';

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendEmail(to, subject, html) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Email not configured. Skipping email to', to);
    return;
  }

  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || 'Honest Label';

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
  });
}

export async function sendInquiryNotification(customerName, customerEmail, message) {
  const adminEmail = process.env.ADMIN_EMAIL || 'hello@honestit.in';
  const subject = `New Quote Request from ${customerName}`;
  const html = `<!DOCTYPE html>
<html>
<head><style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
.content { padding: 20px; background-color: #f9f9f9; }
.field { margin-bottom: 15px; }
.label { font-weight: bold; color: #666; }
</style></head>
<body><div class="container">
<div class="header"><h2>New Quote Request</h2></div>
<div class="content">
<div class="field"><span class="label">Customer Name:</span> ${customerName}</div>
<div class="field"><span class="label">Email:</span> ${customerEmail}</div>
<div class="field"><span class="label">Message:</span><p>${message}</p></div>
</div></div></body></html>`;

  await sendEmail(adminEmail, subject, html);
}

export async function sendInquiryConfirmation(customerEmail, customerName) {
  const subject = 'Thank you for contacting Honest Label';
  const html = `<!DOCTYPE html>
<html>
<head><style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
.content { padding: 20px; background-color: #f9f9f9; }
.footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
</style></head>
<body><div class="container">
<div class="header"><h2>Honest Label</h2></div>
<div class="content">
<p>Dear ${customerName},</p>
<p>Thank you for reaching out to Honest Label! We have received your inquiry and our team will get back to you within 24 hours.</p>
<p>If you have any urgent questions, please feel free to call us at +91 95123 70018.</p>
<p>Best regards,<br>The Honest Label Team</p>
</div>
<div class="footer">
<p>170/171, HonestIT - Corporate House, Ashram Rd, Ahmedabad, Gujarat 380009</p>
<p>Phone: +91 95123 70018 | Email: hello@honestit.in</p>
</div></div></body></html>`;

  await sendEmail(customerEmail, subject, html);
}

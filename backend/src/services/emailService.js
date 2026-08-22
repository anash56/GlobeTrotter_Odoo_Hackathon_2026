import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Send Branded Password Reset Email via Brevo
 * @param {string} toEmail - Recipient email
 * @param {string} toName - Recipient name
 * @param {string} resetUrl - Frontend reset password URL with token
 */
export const sendPasswordResetEmail = async (toEmail, toName, resetUrl) => {
  const apiKey = process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.trim() : '';
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'support@globetrotter.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'GlobeTrotter Support';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 20px; color: #1E293B; }
        .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(6, 55, 94, 0.08); border: 1px solid #E2E8F0; }
        .header { background: #06375E; padding: 32px 24px; text-align: center; color: #ffffff; }
        .logo-title { font-size: 24px; font-weight: 800; letter-spacing: 0.5px; margin: 0; }
        .tagline { font-size: 13px; color: #DCCFC2; margin-top: 4px; }
        .content { padding: 36px 32px; }
        .greeting { font-size: 18px; font-weight: 700; color: #06375E; margin-bottom: 12px; }
        .text { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .btn-wrapper { text-align: center; margin: 32px 0; }
        .btn { background: #06375E; color: #ffffff !important; padding: 14px 32px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px; display: inline-block; box-shadow: 0 4px 14px rgba(6, 55, 94, 0.25); }
        .link-alt { word-break: break-all; font-size: 12px; color: #64748B; background: #F1F5F9; padding: 12px; border-radius: 8px; margin-top: 16px; }
        .footer { background: #F8FAFC; padding: 20px 32px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo-title">🌍 GlobeTrotter</h1>
          <div class="tagline">AI-Powered Travel Planning</div>
        </div>
        <div class="content">
          <div class="greeting">Hello ${toName || 'Traveler'},</div>
          <p class="text">
            We received a request to reset the password for your GlobeTrotter account. Click the button below to choose a new password:
          </p>
          <div class="btn-wrapper">
            <a href="${resetUrl}" target="_blank" class="btn">Reset My Password</a>
          </div>
          <p class="text" style="font-size: 13px; color: #64748B;">
            This link is valid for <strong>15 minutes</strong>. If you did not request a password reset, you can safely ignore this email — your account remains secure.
          </p>
          <div class="link-alt">
            Or copy and paste this link in your browser:<br/>
            <a href="${resetUrl}" style="color: #06375E;">${resetUrl}</a>
          </div>
        </div>
        <div class="footer">
          &copy; 2026 GlobeTrotter Inc. • Explore the world with confidence.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!apiKey) {
    console.warn(`[Brevo EmailService] BREVO_API_KEY not configured in .env. Reset URL generated: ${resetUrl}`);
    return {
      success: true,
      delivered: false,
      message: 'Brevo API key not configured, check console for reset link.',
      resetUrl,
    };
  }

  const payload = {
    subject: 'Reset Your GlobeTrotter Password',
    htmlContent,
    sender: { name: senderName, email: senderEmail },
    to: [{ email: toEmail, name: toName || toEmail }],
  };

  try {
    // Attempt with BrevoClient SDK v6
    const client = new BrevoClient({ apiKey });
    const response = await client.transactionalEmails.sendTransacEmail(payload);
    console.log(`[Brevo EmailService] Reset email successfully dispatched to ${toEmail}`);
    return { success: true, delivered: true, response };
  } catch (sdkError) {
    console.warn('[Brevo EmailService] SDK method error, attempting direct v3 REST API:', sdkError.message);

    // Direct HTTP REST API fallback
    try {
      const restRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify(payload),
      });

      const restData = await restRes.json();
      if (!restRes.ok) {
        throw new Error(restData.message || 'Brevo API rejected the request');
      }

      console.log(`[Brevo EmailService] Reset email successfully sent via Brevo REST API:`, restData.messageId);
      return { success: true, delivered: true, data: restData };
    } catch (restError) {
      console.error('[Brevo EmailService] Failed to send email via Brevo:', restError.message);
      throw new Error(restError.message || 'Failed to send reset email through Brevo.');
    }
  }
};


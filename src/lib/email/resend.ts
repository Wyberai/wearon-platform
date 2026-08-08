import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log('[email] RESEND_API_KEY not set — skipping send');
    return;
  }

  try {
    await resend.emails.send({
      from: 'WearOn <hello@wearon.in>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('[email] Failed to send email:', err);
  }
}

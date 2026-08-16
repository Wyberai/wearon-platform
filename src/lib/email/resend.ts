import { Resend } from 'resend';

export async function sendEmail({
  to,
  subject,
  html,
  from,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log('[email] RESEND_API_KEY not set — skipping send');
    return;
  }

  try {
    // Constructed lazily, after the key check above — the Resend SDK
    // throws immediately if the key is missing, and doing this at module
    // scope crashed the build for every page that imports this file,
    // regardless of whether it ever calls sendEmail.
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: from ?? process.env.EMAIL_FROM ?? 'WearOn <hello@instastarz.in>',
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
  } catch (err) {
    console.error('[email] Failed to send email:', err);
  }
}

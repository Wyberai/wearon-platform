const INK = '#171512'
const ACCENT = '#A6134A'
const BG = '#FAF7F3'

const PLAN_NAMES: Record<string, string> = {
  starter: 'Store',
  growth: 'Store + App',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

export function planUpgradeEmail({
  brandName,
  plan,
  dashboardUrl,
}: {
  brandName: string;
  plan: string;
  dashboardUrl: string;
}): { subject: string; html: string } {
  const planName = PLAN_NAMES[plan] ?? plan
  const subject = `You're now on ${planName} — welcome to the upgrade`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:Georgia,'Times New Roman',serif;color:${INK};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <tr>
            <td style="padding:0 0 28px 0;text-align:center;">
              <span style="font-size:22px;font-weight:600;letter-spacing:-0.3px;color:${INK};">Instastarz</span>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;border-radius:6px;padding:44px 40px;">
              <p style="margin:0 0 10px 0;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${ACCENT};font-family:Arial,sans-serif;">
                Plan upgraded
              </p>
              <h1 style="margin:0 0 16px 0;font-size:28px;font-weight:400;line-height:1.3;color:${INK};">
                ${brandName} is now on ${planName}
              </h1>
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.7;color:${INK};">
                Your new features and limits are active immediately — no restart needed. Head to your dashboard to explore everything that's unlocked.
              </p>
              <a href="${dashboardUrl}" target="_blank"
                style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;font-family:Arial,sans-serif;color:#ffffff;text-decoration:none;background:${ACCENT};border-radius:4px;">
                Open dashboard →
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:13px;color:#6B6459;font-family:Arial,sans-serif;">
                Questions? Reply to this email or visit
                <a href="https://instastarz.in" style="color:${ACCENT};text-decoration:none;">instastarz.in</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, html }
}

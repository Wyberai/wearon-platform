const INK = '#171512'
const ACCENT = '#A6134A'
const BG = '#FAF7F3'

export function tryOnNotificationEmail({
  brandName,
  productName,
  resultUrl,
  slug,
}: {
  brandName: string
  productName: string
  resultUrl?: string
  slug: string
}): { subject: string; html: string } {
  const dashboardUrl = `https://instastarz.in/admin/${slug}/analytics`
  const settingsUrl = `https://instastarz.in/admin/${slug}/settings`

  return {
    subject: `A customer just tried on ${productName}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New try-on — ${brandName}</title>
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
                virtual try-on
              </p>
              <h1 style="margin:0 0 16px 0;font-size:26px;font-weight:400;line-height:1.3;color:${INK};">
                Someone tried on ${productName}
              </h1>
              <p style="margin:0 0 28px 0;font-size:15px;line-height:1.7;color:${INK}bb;font-family:Arial,sans-serif;">
                A customer in your <strong style="color:${INK};">${brandName}</strong> store used AI Try-On on this product. Shoppers who try-on convert 3× more.
              </p>

              ${resultUrl ? `
              <div style="margin:0 0 28px 0;border-radius:8px;overflow:hidden;border:1px solid ${INK}14;">
                <img src="${resultUrl}" alt="Try-on result" style="width:100%;display:block;max-height:420px;object-fit:cover;" />
              </div>
              ` : ''}

              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="border-radius:999px;background:${INK};">
                    <a href="${dashboardUrl}" target="_blank"
                      style="display:inline-block;padding:14px 30px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;">
                      View analytics →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 24px 0;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:12px;color:${INK}77;font-family:Arial,sans-serif;">
                Order notifications for <strong style="color:${INK}88;">${brandName}</strong> on Instastarz.
              </p>
              <p style="margin:0;font-size:12px;font-family:Arial,sans-serif;">
                <a href="${settingsUrl}" style="color:${INK}99;text-decoration:none;">Manage notifications</a>
                &nbsp;·&nbsp;
                <a href="https://instastarz.in" style="color:${INK}77;text-decoration:none;">instastarz.in</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  }
}

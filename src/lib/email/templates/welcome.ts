const INK = '#171512'
const ACCENT = '#A6134A'
const BG = '#FAF7F3'

export function welcomeEmail({
  brandName,
  sellerName,
  storeUrl,
}: {
  brandName: string;
  sellerName: string;
  storeUrl: string;
}): { subject: string; html: string } {
  const subject = 'Welcome to Instastarz — your store is live';

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
                Your store is live
              </p>
              <h1 style="margin:0 0 16px 0;font-size:28px;font-weight:400;line-height:1.3;color:${INK};">
                Welcome, ${sellerName}
              </h1>
              <p style="margin:0 0 28px 0;font-size:15px;line-height:1.7;color:${INK}bb;font-family:Arial,sans-serif;">
                <strong style="color:${INK};">${brandName}</strong> is live and ready for customers.
                Start adding your collection and watch the orders roll in.
              </p>

              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px 0;">
                <tr>
                  <td style="border-radius:999px;background:${INK};">
                    <a href="${storeUrl}" target="_blank"
                      style="display:inline-block;padding:14px 30px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;">
                      Visit your store →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 32px 0;font-size:12px;color:${INK}77;word-break:break-all;font-family:Arial,sans-serif;">
                ${storeUrl}
              </p>

              <div style="border-top:1px solid ${INK}14;padding-top:28px;">
                <p style="margin:0 0 18px 0;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:${INK}77;font-family:Arial,sans-serif;">
                  Three things to do first
                </p>
                ${[
                  ['Add your first product', 'Upload photos, set your price, and go live in under 2 minutes.'],
                  ['Share your link in bio', 'Drop your store URL on Instagram, WhatsApp, anywhere your audience is.'],
                  ['Pick a theme', 'Customize Store has 10 distinct looks — from editorial to Instagram-feed style.'],
                ].map(([title, body]) => `
                  <div style="padding:14px 0;border-bottom:1px solid ${INK}0f;">
                    <p style="margin:0 0 3px 0;font-size:14px;font-weight:700;color:${INK};font-family:Arial,sans-serif;">${title}</p>
                    <p style="margin:0;font-size:13px;line-height:1.5;color:${INK}99;font-family:Arial,sans-serif;">${body}</p>
                  </div>
                `).join('')}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 24px 0;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:12px;color:${INK}77;font-family:Arial,sans-serif;">
                You're receiving this because you created a store on Instastarz.
              </p>
              <p style="margin:0;font-size:12px;color:${INK}77;font-family:Arial,sans-serif;">
                <a href="https://instastarz.in" style="color:${INK}99;text-decoration:none;">instastarz.in</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

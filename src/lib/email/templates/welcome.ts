export function welcomeEmail({
  brandName,
  sellerName,
  storeUrl,
}: {
  brandName: string;
  sellerName: string;
  storeUrl: string;
}): { subject: string; html: string } {
  const subject = "Welcome to WearOn — your boutique is live 🎉";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#09090B;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#FAFAFA;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090B;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;text-align:center;">
              <span style="font-size:28px;font-weight:800;letter-spacing:-0.5px;color:#FAFAFA;">
                Wear<span style="color:#F72585;">On</span>
              </span>
            </td>
          </tr>

          <!-- Hero card -->
          <tr>
            <td style="background:#18181B;border-radius:16px;padding:40px 40px 36px 40px;border:1px solid #27272A;">
              <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#F72585;">
                Your store is live
              </p>
              <h1 style="margin:0 0 16px 0;font-size:30px;font-weight:800;line-height:1.2;color:#FAFAFA;">
                Welcome to WearOn,<br />${sellerName} 🎉
              </h1>
              <p style="margin:0 0 28px 0;font-size:16px;line-height:1.6;color:#A1A1AA;">
                Your boutique <strong style="color:#FAFAFA;">${brandName}</strong> is live and ready for customers.
                Start adding your collection and watch the orders roll in.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 36px 0;">
                <tr>
                  <td style="border-radius:10px;background:#F72585;">
                    <a href="${storeUrl}" target="_blank"
                      style="display:inline-block;padding:14px 32px;font-size:16px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.2px;">
                      Visit your store →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px 0;font-size:12px;color:#52525B;word-break:break-all;">
                ${storeUrl}
              </p>
            </td>
          </tr>

          <!-- Quick-start tips -->
          <tr>
            <td style="padding:32px 0 0 0;">
              <p style="margin:0 0 20px 0;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#71717A;text-align:center;">
                3 quick-start tips
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Tip 1 -->
                <tr>
                  <td style="background:#18181B;border-radius:12px;padding:20px 24px;margin-bottom:12px;border:1px solid #27272A;display:block;margin-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" valign="top">
                          <span style="display:inline-block;width:32px;height:32px;border-radius:8px;background:#F72585;text-align:center;line-height:32px;font-size:16px;">
                            👗
                          </span>
                        </td>
                        <td style="padding-left:14px;">
                          <p style="margin:0 0 4px 0;font-size:15px;font-weight:700;color:#FAFAFA;">Add your first product</p>
                          <p style="margin:0;font-size:14px;line-height:1.5;color:#A1A1AA;">
                            Upload photos, set your price, and go live in under 2 minutes.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr><td style="height:10px;"></td></tr>

                <!-- Tip 2 -->
                <tr>
                  <td style="background:#18181B;border-radius:12px;padding:20px 24px;border:1px solid #27272A;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" valign="top">
                          <span style="display:inline-block;width:32px;height:32px;border-radius:8px;background:#7C3AED;text-align:center;line-height:32px;font-size:16px;">
                            📲
                          </span>
                        </td>
                        <td style="padding-left:14px;">
                          <p style="margin:0 0 4px 0;font-size:15px;font-weight:700;color:#FAFAFA;">Share your link in bio</p>
                          <p style="margin:0;font-size:14px;line-height:1.5;color:#A1A1AA;">
                            Drop your store URL on Instagram, WhatsApp, and anywhere your audience is.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr><td style="height:10px;"></td></tr>

                <!-- Tip 3 -->
                <tr>
                  <td style="background:#18181B;border-radius:12px;padding:20px 24px;border:1px solid #27272A;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" valign="top">
                          <span style="display:inline-block;width:32px;height:32px;border-radius:8px;background:#0EA5E9;text-align:center;line-height:32px;font-size:16px;">
                            ✨
                          </span>
                        </td>
                        <td style="padding-left:14px;">
                          <p style="margin:0 0 4px 0;font-size:15px;font-weight:700;color:#FAFAFA;">Upgrade for AI try-on</p>
                          <p style="margin:0;font-size:14px;line-height:1.5;color:#A1A1AA;">
                            Let customers virtually try on your pieces — the fastest way to kill return anxiety and boost conversions.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:36px 0 0 0;text-align:center;border-top:1px solid #27272A;margin-top:32px;">
              <p style="margin:0 0 8px 0;font-size:13px;color:#52525B;">
                You're receiving this because you created a store on WearOn.
              </p>
              <p style="margin:0;font-size:13px;color:#52525B;">
                <a href="#" style="color:#F72585;text-decoration:none;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="https://wearon.in" style="color:#71717A;text-decoration:none;">wearon.in</a>
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

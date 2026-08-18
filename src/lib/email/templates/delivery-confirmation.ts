export function deliveryConfirmationEmail({
  brandName,
  primaryColor = '#F72585',
  orderId,
  items,
  totalInr,
  storeSlug,
}: {
  brandName: string
  primaryColor?: string
  orderId: string
  items: { name: string; qty: number; price: number }[]
  totalInr: number
  storeSlug: string
}): { subject: string; html: string } {
  const subject = `Your order from ${brandName} has been delivered!`
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://instastarz.in'
  const storeUrl = `${baseUrl}/store/${storeSlug}`

  const itemRows = items.map(item => `
    <tr>
      <td style="padding:10px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;">
        ${item.name} × ${item.qty}
      </td>
      <td style="padding:10px 0;font-size:14px;font-weight:600;color:#111827;text-align:right;border-bottom:1px solid #f3f4f6;">
        ₹${(item.price * item.qty).toLocaleString('en-IN')}
      </td>
    </tr>`).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:${primaryColor};padding:28px 40px;">
              <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">${brandName}</p>
              <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">Order Delivered</p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 40px;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#111827;">Your order has arrived! 📦</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">
                We hope you love your purchase from ${brandName}. If anything isn't right, just reply to this email.
              </p>

              <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#9ca3af;">Order #${orderId.slice(0, 8)}</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                ${itemRows}
                <tr>
                  <td style="padding:12px 0 0;font-size:15px;font-weight:700;color:#111827;">Total</td>
                  <td style="padding:12px 0 0;font-size:16px;font-weight:800;color:${primaryColor};text-align:right;">₹${totalInr.toLocaleString('en-IN')}</td>
                </tr>
              </table>

              <a href="${storeUrl}" target="_blank"
                style="display:block;padding:14px 0;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;text-align:center;background:${primaryColor};border-radius:10px;margin-bottom:12px;">
                Shop again at ${brandName}
              </a>

              <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;text-align:center;">
                Love what you got? Tell a friend about ${brandName}.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Powered by <a href="${baseUrl}" style="color:#9ca3af;text-decoration:none;">Instastarz</a>
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

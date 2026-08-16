export function orderEmail({
  brandName,
  orderId,
  items,
  totalInr,
  buyerPhone,
}: {
  brandName: string;
  orderId: string;
  items: { name: string; qty: number; price: number }[];
  totalInr: number;
  buyerPhone?: string;
}): { subject: string; html: string } {
  const subject = `New order received — ₹${totalInr.toLocaleString('en-IN')} 🛍️`;

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 16px;font-size:14px;color:#FAFAFA;border-bottom:1px solid #27272A;">
          ${item.name}
        </td>
        <td style="padding:12px 16px;font-size:14px;color:#A1A1AA;text-align:center;border-bottom:1px solid #27272A;">
          ${item.qty}
        </td>
        <td style="padding:12px 16px;font-size:14px;color:#FAFAFA;text-align:right;border-bottom:1px solid #27272A;">
          ₹${item.price.toLocaleString('en-IN')}
        </td>
        <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#F72585;text-align:right;border-bottom:1px solid #27272A;">
          ₹${(item.qty * item.price).toLocaleString('en-IN')}
        </td>
      </tr>`
    )
    .join('');

  const whatsappLink = buyerPhone
    ? `https://wa.me/${buyerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi! I'm reaching out from ${brandName} regarding your order #${orderId}. How can I help you?`)}`
    : null;

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

          <!-- Alert card -->
          <tr>
            <td style="background:#18181B;border-radius:16px;padding:32px 40px;border:1px solid #27272A;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#F72585;">
                      New order · ${brandName}
                    </p>
                    <h1 style="margin:0 0 4px 0;font-size:28px;font-weight:800;color:#FAFAFA;">
                      ₹${totalInr.toLocaleString('en-IN')} received 🛍️
                    </h1>
                    <p style="margin:0;font-size:13px;color:#71717A;">Order ID: <span style="font-family:monospace;color:#A1A1AA;">${orderId}</span></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order table -->
          <tr>
            <td style="padding:24px 0 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181B;border-radius:12px;border:1px solid #27272A;overflow:hidden;">
                <!-- Table header -->
                <tr style="background:#27272A;">
                  <th style="padding:10px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#71717A;text-align:left;">Item</th>
                  <th style="padding:10px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#71717A;text-align:center;">Qty</th>
                  <th style="padding:10px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#71717A;text-align:right;">Unit</th>
                  <th style="padding:10px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#71717A;text-align:right;">Subtotal</th>
                </tr>
                ${itemRows}
                <!-- Total row -->
                <tr style="background:#1C1C1F;">
                  <td colspan="3" style="padding:14px 16px;font-size:15px;font-weight:700;color:#FAFAFA;text-align:right;">
                    Total
                  </td>
                  <td style="padding:14px 16px;font-size:16px;font-weight:800;color:#F72585;text-align:right;">
                    ₹${totalInr.toLocaleString('en-IN')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            buyerPhone
              ? `<!-- Buyer info -->
          <tr>
            <td style="padding:20px 0 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181B;border-radius:12px;padding:20px 24px;border:1px solid #27272A;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#71717A;">Buyer contact</p>
                    <p style="margin:0;font-size:15px;color:#FAFAFA;">📞 ${buyerPhone}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ''
          }

          <!-- CTA buttons -->
          <tr>
            <td style="padding:24px 0 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:8px;">
                    <a href="https://instastarz.in/admin/orders/${orderId}" target="_blank"
                      style="display:block;padding:14px 0;font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;text-align:center;background:#F72585;border-radius:10px;">
                      View order →
                    </a>
                  </td>
                  ${
                    whatsappLink
                      ? `<td style="padding-left:8px;">
                    <a href="${whatsappLink}" target="_blank"
                      style="display:block;padding:14px 0;font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;text-align:center;background:#25D366;border-radius:10px;">
                      WhatsApp buyer
                    </a>
                  </td>`
                      : ''
                  }
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:36px 0 0 0;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:13px;color:#52525B;">
                Order notifications for <strong style="color:#71717A;">${brandName}</strong> on WearOn.
              </p>
              <p style="margin:0;font-size:13px;color:#52525B;">
                <a href="#" style="color:#F72585;text-decoration:none;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="https://instastarz.in" style="color:#71717A;text-decoration:none;">instastarz.in</a>
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

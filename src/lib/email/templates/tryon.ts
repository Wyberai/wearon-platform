export function tryOnNotificationEmail({
  brandName,
  productName,
  resultUrl,
}: {
  brandName: string
  productName: string
  resultUrl?: string
}): { subject: string; html: string } {
  return {
    subject: `A customer just tried on ${productName}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090B;font-family:'Segoe UI',Arial,sans-serif;color:#fff;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="margin-bottom:32px;">
      <span style="background:#F72585;color:#fff;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">WearOn</span>
    </div>
    <h1 style="font-size:28px;font-weight:700;margin:0 0 8px;color:#fff;">
      🎉 Someone tried on your product!
    </h1>
    <p style="font-size:16px;color:#a1a1aa;margin:0 0 24px;line-height:1.6;">
      A customer tried on <strong style="color:#fff;">${productName}</strong> in your <strong style="color:#F72585;">${brandName}</strong> store.
    </p>
    ${resultUrl ? `
    <div style="margin:24px 0;border-radius:12px;overflow:hidden;border:1px solid #27272a;">
      <img src="${resultUrl}" alt="Try-on result" style="width:100%;display:block;max-height:400px;object-fit:cover;">
    </div>
    ` : ''}
    <p style="font-size:15px;color:#a1a1aa;margin:0 0 24px;line-height:1.6;">
      Try-ons drive 3× more WhatsApp orders. Keep adding products to give more customers this experience.
    </p>
    <a href="https://wearon.in/admin" style="display:inline-block;background:#F72585;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
      View Your Analytics →
    </a>
    <hr style="border:none;border-top:1px solid #27272a;margin:40px 0;">
    <p style="font-size:12px;color:#52525b;margin:0;text-align:center;">
      You're receiving this because you have a store on WearOn · <a href="#" style="color:#F72585;text-decoration:none;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`,
  }
}

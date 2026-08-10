const INK = '#171512'
const ACCENT = '#A6134A'
const BG = '#FAF7F3'

function shell(preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:${BG};font-family:Georgia,'Times New Roman',serif;color:${INK};">
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="padding:0 0 28px 0;text-align:center;">
          <span style="font-size:22px;font-weight:600;letter-spacing:-0.3px;color:${INK};">WearOn</span>
        </td></tr>
        ${body}
        <tr><td style="padding:36px 24px 0;text-align:center;border-top:1px solid ${INK}1a;margin-top:32px;">
          <p style="margin:0 0 8px 0;font-size:12px;color:${INK}88;font-family:Arial,sans-serif;">
            You're getting this because you asked to preview your store on WearOn.
          </p>
          <p style="margin:0;font-size:12px;color:${INK}88;font-family:Arial,sans-serif;">
            <a href="{{UNSUBSCRIBE_URL}}" style="color:${INK}99;text-decoration:underline;">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function button(href: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:0 auto 8px;">
    <tr><td style="border-radius:999px;background:${INK};">
      <a href="${href}" target="_blank" style="display:inline-block;padding:14px 30px;font-size:15px;font-weight:600;color:#fff;text-decoration:none;font-family:Arial,sans-serif;">${label}</a>
    </td></tr>
  </table>`
}

interface NurtureCtx {
  brandName: string
  previewUrl: string
  signupUrl: string
  themeName: string
}

export function leadNurtureEmail(step: 1 | 2 | 3 | 4, ctx: NurtureCtx): { subject: string; html: string } {
  const { brandName, previewUrl, signupUrl, themeName } = ctx

  if (step === 1) {
    return {
      subject: `${brandName} is still live — take another look?`,
      html: shell(`Your ${brandName} preview is still up`, `
        <tr><td style="background:#fff;border-radius:6px;padding:40px;text-align:center;">
          <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${ACCENT};font-family:Arial,sans-serif;">still waiting for you</p>
          <h1 style="margin:0 0 16px 0;font-size:26px;font-weight:400;line-height:1.3;">Your ${brandName} store is still live</h1>
          <p style="margin:0 0 28px 0;font-size:15px;line-height:1.7;color:${INK}bb;font-family:Arial,sans-serif;">
            You picked the <strong>${themeName}</strong> look last week. It's still sitting there, ready — nobody's touched it. Takes 10 minutes to make it real.
          </p>
          ${button(previewUrl, 'See it again →')}
        </td></tr>
      `),
    }
  }

  if (step === 2) {
    return {
      subject: 'The part buyers actually care about: no more DM back-and-forth',
      html: shell('WhatsApp checkout on every product', `
        <tr><td style="background:#fff;border-radius:6px;padding:40px;text-align:center;">
          <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${ACCENT};font-family:Arial,sans-serif;">what actually changes</p>
          <h1 style="margin:0 0 16px 0;font-size:26px;font-weight:400;line-height:1.3;">Buyers tap. You don't type.</h1>
          <p style="margin:0 0 28px 0;font-size:15px;line-height:1.7;color:${INK}bb;font-family:Arial,sans-serif;">
            Every product on your store gets a WhatsApp order button — size, color, price already filled in. Your phone buzzes with an order, not another "how much?" DM.
          </p>
          ${button(signupUrl, 'Set up my store, free →')}
          <p style="margin:14px 0 0 0;font-size:12px;color:${INK}77;font-family:Arial,sans-serif;">No card needed to start.</p>
        </td></tr>
      `),
    }
  }

  if (step === 3) {
    return {
      subject: 'Your Instagram bio link can do more than list links',
      html: shell('Turn your one bio link into a real store', `
        <tr><td style="background:#fff;border-radius:6px;padding:40px;text-align:center;">
          <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${ACCENT};font-family:Arial,sans-serif;">the one-link problem</p>
          <h1 style="margin:0 0 16px 0;font-size:26px;font-weight:400;line-height:1.3;">Instagram gives you one link. Make it count.</h1>
          <p style="margin:0 0 28px 0;font-size:15px;line-height:1.7;color:${INK}bb;font-family:Arial,sans-serif;">
            A Reel does big numbers, comments flood in — and none of it converts because there's nowhere to actually buy. Your ${brandName} store fixes exactly that: one link, full catalogue, real checkout.
          </p>
          ${button(previewUrl, 'Walk through my store →')}
        </td></tr>
      `),
    }
  }

  return {
    subject: `Last check-in on ${brandName} — no pressure`,
    html: shell('Still here if you want it', `
      <tr><td style="background:#fff;border-radius:6px;padding:40px;text-align:center;">
        <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${ACCENT};font-family:Arial,sans-serif;">no pressure</p>
        <h1 style="margin:0 0 16px 0;font-size:26px;font-weight:400;line-height:1.3;">This is the last one we'll send</h1>
        <p style="margin:0 0 28px 0;font-size:15px;line-height:1.7;color:${INK}bb;font-family:Arial,sans-serif;">
          Your ${brandName} preview is still there if you want it — free plan, no card, live in 10 minutes. If now's not the time, no worries, we'll stop here.
        </p>
        ${button(signupUrl, 'Make it real →')}
      </td></tr>
    `),
  }
}

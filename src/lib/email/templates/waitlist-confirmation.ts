import type { Locale } from '@/lib/i18n/config'
import { BRAND, brandMarkSvg } from '@/lib/brand'

const BG = '#FAF7F3'

// Same table-based shell pattern as lead-nurture.ts, so every Instastarz
// lifecycle email shares one look — logo mark instead of a text wordmark
// here since this is the very first email a prospect ever gets from us.
function shell(preheader: string, body: string): string {
  const markDataUri = `data:image/svg+xml;base64,${Buffer.from(brandMarkSvg(28)).toString('base64')}`
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:${BG};font-family:Georgia,'Times New Roman',serif;color:${BRAND.ink};">
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="padding:0 0 28px 0;text-align:center;">
          <img src="${markDataUri}" width="28" height="28" alt="" style="vertical-align:middle;margin-right:8px;" />
          <span style="font-size:22px;font-weight:600;letter-spacing:-0.3px;color:${BRAND.ink};vertical-align:middle;">Instastarz</span>
        </td></tr>
        ${body}
        <tr><td style="padding:36px 24px 0;text-align:center;border-top:1px solid ${BRAND.ink}1a;margin-top:32px;">
          <p style="margin:0;font-size:12px;color:${BRAND.ink}88;font-family:Arial,sans-serif;">
            Instastarz · Signalpulse Technologies
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

interface WaitlistEmailCopy {
  subject: string
  preheader: string
  eyebrow: string
  heading: string
  body: string
}

const COPY: Record<Locale, WaitlistEmailCopy> = {
  en: {
    subject: "You're on the Instastarz waitlist 🎉",
    preheader: "We'll email you the moment we open.",
    eyebrow: "You're in",
    heading: "You're on the list",
    body: "Instastarz is live now — head to instastarz.in to launch your store. Follow along on Instagram for tips and updates.",
  },
  hi: {
    subject: 'आप Instastarz वेटलिस्ट में शामिल हो गए हैं 🎉',
    preheader: 'जैसे ही हम खुलेंगे, हम आपको ईमेल करेंगे।',
    eyebrow: 'आप शामिल हो गए',
    heading: 'आप लिस्ट में हैं',
    body: 'Instastarz अभी लाइव है — अपना स्टोर शुरू करने के लिए instastarz.in पर जाएं। टिप्स और अपडेट के लिए हमें Instagram पर फॉलो करें।',
  },
  kn: {
    subject: 'ನೀವು Instastarz ವೇಟ್‌ಲಿಸ್ಟ್‌ಗೆ ಸೇರಿದ್ದೀರಿ 🎉',
    preheader: 'ನಾವು ತೆರೆದ ಕ್ಷಣ ನಾವು ನಿಮಗೆ ಇಮೇಲ್ ಮಾಡುತ್ತೇವೆ.',
    eyebrow: 'ನೀವು ಸೇರಿದ್ದೀರಿ',
    heading: 'ನೀವು ಪಟ್ಟಿಯಲ್ಲಿದ್ದೀರಿ',
    body: 'Instastarz ಈಗ ಲೈವ್ ಆಗಿದೆ — ನಿಮ್ಮ ಸ್ಟೋರ್ ಪ್ರಾರಂಭಿಸಲು instastarz.in ಗೆ ಭೇಟಿ ನೀಡಿ. ಟಿಪ್ಸ್ ಮತ್ತು ಅಪ್‌ಡೇಟ್‌ಗಳಿಗಾಗಿ ನಮ್ಮನ್ನು Instagram ನಲ್ಲಿ ಫಾಲೋ ಮಾಡಿ.',
  },
  te: {
    subject: 'మీరు Instastarz వెయిట్‌లిస్ట్‌లో చేరారు 🎉',
    preheader: 'మేము తెరిచిన వెంటనే మేము మీకు ఇమెయిల్ చేస్తాము.',
    eyebrow: 'మీరు చేరారు',
    heading: 'మీరు లిస్ట్‌లో ఉన్నారు',
    body: 'Instastarz ఇప్పుడు లైవ్‌లో ఉంది — మీ స్టోర్ ప్రారంభించడానికి instastarz.in సందర్శించండి. టిప్స్ మరియు అప్‌డేట్‌ల కోసం మమ్మల్ని Instagram‌లో ఫాలో అవ్వండి.',
  },
  mr: {
    subject: 'तुम्ही Instastarz वेटलिस्टमध्ये सामील झालात 🎉',
    preheader: 'आम्ही सुरू करताच आम्ही तुम्हाला ईमेल करू.',
    eyebrow: 'तुम्ही सामील झालात',
    heading: 'तुम्ही लिस्टमध्ये आहात',
    body: 'Instastarz आता लाइव्ह आहे — तुमचं स्टोअर सुरू करण्यासाठी instastarz.in ला भेट द्या. टिप्स आणि अपडेट्ससाठी आम्हाला Instagram वर फॉलो करा.',
  },
  ta: {
    subject: 'நீங்கள் Instastarz வெயிட்லிஸ்டில் சேர்ந்துவிட்டீர்கள் 🎉',
    preheader: 'நாங்கள் திறந்தவுடன் உங்களுக்கு மின்னஞ்சல் அனுப்புவோம்.',
    eyebrow: 'நீங்கள் சேர்ந்துவிட்டீர்கள்',
    heading: 'நீங்கள் பட்டியலில் இருக்கிறீர்கள்',
    body: 'Instastarz இப்போது லைவ் ஆகிவிட்டது — உங்கள் ஸ்டோரைத் தொடங்க instastarz.in ஐப் பார்வையிடுங்கள். டிப்ஸ் மற்றும் அப்டேட்களுக்கு எங்களை Instagram-ல் பின்தொடருங்கள்.',
  },
}

export function waitlistConfirmationEmail(locale: Locale): { subject: string; html: string } {
  const c = COPY[locale] ?? COPY.en
  return {
    subject: c.subject,
    html: shell(c.preheader, `
      <tr><td style="background:#fff;border-radius:6px;padding:40px;text-align:center;">
        <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.accent};font-family:Arial,sans-serif;">${c.eyebrow}</p>
        <h1 style="margin:0 0 16px 0;font-size:26px;font-weight:400;line-height:1.3;">${c.heading}</h1>
        <p style="margin:0;font-size:15px;line-height:1.7;color:${BRAND.ink}bb;font-family:Arial,sans-serif;">${c.body}</p>
      </td></tr>
    `),
  }
}

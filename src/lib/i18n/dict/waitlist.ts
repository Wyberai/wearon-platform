import type { Locale } from '../config'

export interface WaitlistDict {
  launchBadge: string
  heroHeadline: string
  heroSubcopy: string
  handlePlaceholder: string
  joinButton: string
  joiningButton: string
  noSpamNote: string
  successTitle: string
  successBody: string
  featuresEyebrow: string
  featuresHeadline: string
  closingHeadline: string
  closingDoneMessage: string
}

export const WAITLIST_DICT: Record<Locale, WaitlistDict> = {
  en: {
    launchBadge: 'Opening August 21',
    heroHeadline: 'Be the first to register and turn your Instagram page into a real online store.',
    heroSubcopy: "A real storefront, real checkout, your own domain — join the waitlist and we'll email you the moment Instastarz opens.",
    handlePlaceholder: 'Your Instagram handle (optional)',
    joinButton: 'Join the waitlist →',
    joiningButton: 'Joining...',
    noSpamNote: 'No spam, ever. Just one email when we open the doors.',
    successTitle: "You're on the list 🎉",
    successBody: "Check your inbox — we'll be in touch soon.",
    featuresEyebrow: 'Everything launching August 21',
    featuresHeadline: "Everything you'll get from day one.",
    closingHeadline: "Don't miss August 21.",
    closingDoneMessage: "You're on the list — see you at launch 🎉",
  },
  hi: {
    launchBadge: '21 अगस्त को लॉन्च हो रहा है',
    heroHeadline: 'सबसे पहले रजिस्टर करें और अपने Instagram पेज को असली ऑनलाइन स्टोर बनाएं।',
    heroSubcopy: 'असली स्टोरफ्रंट, असली चेकआउट, आपका अपना डोमेन — वेटलिस्ट में शामिल हों और जैसे ही Instastarz खुलेगा हम आपको ईमेल करेंगे।',
    handlePlaceholder: 'आपका Instagram हैंडल (वैकल्पिक)',
    joinButton: 'वेटलिस्ट में शामिल हों →',
    joiningButton: 'जुड़ रहे हैं...',
    noSpamNote: 'कभी स्पैम नहीं। जब हम शुरू करेंगे तो सिर्फ़ एक ईमेल।',
    successTitle: 'आप लिस्ट में हैं 🎉',
    successBody: 'अपना इनबॉक्स देखें — हम जल्द ही संपर्क करेंगे।',
    featuresEyebrow: '21 अगस्त से लॉन्च हो रहा सब कुछ',
    featuresHeadline: 'पहले दिन से आपको यह सब मिलेगा।',
    closingHeadline: '21 अगस्त मिस न करें।',
    closingDoneMessage: 'आप लिस्ट में हैं — लॉन्च पर मिलते हैं 🎉',
  },
  kn: {
    launchBadge: 'ಆಗಸ್ಟ್ 21 ರಂದು ಲಾಂಚ್ ಆಗುತ್ತಿದೆ',
    heroHeadline: 'ಮೊದಲು ನೋಂದಣಿ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ Instagram ಪೇಜ್ ಅನ್ನು ನಿಜವಾದ ಆನ್‌ಲೈನ್ ಸ್ಟೋರ್ ಆಗಿ ಪರಿವರ್ತಿಸಿ.',
    heroSubcopy: 'ನಿಜವಾದ ಸ್ಟೋರ್‌ಫ್ರಂಟ್, ನಿಜವಾದ ಚೆಕ್‌ಔಟ್, ನಿಮ್ಮ ಸ್ವಂತ ಡೊಮೇನ್ — ವೇಟ್‌ಲಿಸ್ಟ್‌ಗೆ ಸೇರಿ ಮತ್ತು Instastarz ತೆರೆದ ಕ್ಷಣ ನಾವು ನಿಮಗೆ ಇಮೇಲ್ ಮಾಡುತ್ತೇವೆ.',
    handlePlaceholder: 'ನಿಮ್ಮ Instagram ಹ್ಯಾಂಡಲ್ (ಆಯ್ಕಿಕ)',
    joinButton: 'ವೇಟ್‌ಲಿಸ್ಟ್‌ಗೆ ಸೇರಿ →',
    joiningButton: 'ಸೇರುತ್ತಿದೆ...',
    noSpamNote: 'ಎಂದಿಗೂ ಸ್ಪ್ಯಾಮ್ ಇಲ್ಲ. ನಾವು ಬಾಗಿಲು ತೆರೆದಾಗ ಕೇವಲ ಒಂದು ಇಮೇಲ್.',
    successTitle: 'ನೀವು ಪಟ್ಟಿಯಲ್ಲಿದ್ದೀರಿ 🎉',
    successBody: 'ನಿಮ್ಮ ಇನ್‌ಬಾಕ್ಸ್ ಪರಿಶೀಲಿಸಿ — ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.',
    featuresEyebrow: 'ಆಗಸ್ಟ್ 21 ರಿಂದ ಲಾಂಚ್ ಆಗುತ್ತಿರುವ ಎಲ್ಲವೂ',
    featuresHeadline: 'ಮೊದಲ ದಿನದಿಂದ ನಿಮಗೆ ಸಿಗುವುದು ಇದೆಲ್ಲ.',
    closingHeadline: 'ಆಗಸ್ಟ್ 21 ಅನ್ನು ತಪ್ಪಿಸಿಕೊಳ್ಳಬೇಡಿ.',
    closingDoneMessage: 'ನೀವು ಪಟ್ಟಿಯಲ್ಲಿದ್ದೀರಿ — ಲಾಂಚ್‌ನಲ್ಲಿ ನಿಮ್ಮನ್ನು ನೋಡುತ್ತೇವೆ 🎉',
  },
  te: {
    launchBadge: 'ఆగస్టు 21న లాంచ్ అవుతోంది',
    heroHeadline: 'మొదట రిజిస్టర్ చేయండి, మీ Instagram పేజీని నిజమైన ఆన్‌లైన్ స్టోర్‌గా మార్చండి.',
    heroSubcopy: 'నిజమైన స్టోర్‌ఫ్రంట్, నిజమైన చెక్‌అవుట్, మీ స్వంత డొమైన్ — వెయిట్‌లిస్ట్‌లో చేరండి, Instastarz తెరిచిన వెంటనే మేము మీకు ఇమెయిల్ చేస్తాము.',
    handlePlaceholder: 'మీ Instagram హ్యాండిల్ (ఐచ్ఛికం)',
    joinButton: 'వెయిట్‌లిస్ట్‌లో చేరండి →',
    joiningButton: 'చేరుతోంది...',
    noSpamNote: 'స్పామ్ ఎప్పుడూ ఉండదు. మేము తెరిచినప్పుడు ఒక్క ఇమెయిల్ మాత్రమే.',
    successTitle: 'మీరు లిస్ట్‌లో ఉన్నారు 🎉',
    successBody: 'మీ ఇన్‌బాక్స్ చూడండి — మేము త్వరలో సంప్రదిస్తాము.',
    featuresEyebrow: 'ఆగస్టు 21 నుండి లాంచ్ అవుతున్న ప్రతిదీ',
    featuresHeadline: 'మొదటి రోజు నుండి మీకు లభించేది ఇదంతా.',
    closingHeadline: 'ఆగస్టు 21ని మిస్ కావద్దు.',
    closingDoneMessage: 'మీరు లిస్ట్‌లో ఉన్నారు — లాంచ్‌లో కలుద్దాం 🎉',
  },
  mr: {
    launchBadge: '२१ ऑगस्टला लाँच होत आहे',
    heroHeadline: 'आधी नोंदणी करा आणि तुमचं Instagram पेज खऱ्या ऑनलाइन स्टोअरमध्ये बदला.',
    heroSubcopy: 'खरं स्टोअरफ्रंट, खरं चेकआउट, तुमचं स्वतःचं डोमेन — वेटलिस्टमध्ये सामील व्हा आणि Instastarz सुरू होताच आम्ही तुम्हाला ईमेल करू.',
    handlePlaceholder: 'तुमचं Instagram हँडल (पर्यायी)',
    joinButton: 'वेटलिस्टमध्ये सामील व्हा →',
    joiningButton: 'सामील होत आहे...',
    noSpamNote: 'कधीही स्पॅम नाही. आम्ही सुरू करताना फक्त एक ईमेल.',
    successTitle: 'तुम्ही लिस्टमध्ये आहात 🎉',
    successBody: 'तुमचा इनबॉक्स तपासा — आम्ही लवकरच संपर्क करू.',
    featuresEyebrow: '२१ ऑगस्टपासून लाँच होणारं सर्व काही',
    featuresHeadline: 'पहिल्या दिवसापासून तुम्हाला हे सर्व मिळेल.',
    closingHeadline: '२१ ऑगस्ट चुकवू नका.',
    closingDoneMessage: 'तुम्ही लिस्टमध्ये आहात — लाँचला भेटू 🎉',
  },
  ta: {
    launchBadge: 'ஆகஸ்ட் 21 அன்று தொடங்குகிறது',
    heroHeadline: 'முதலில் பதிவு செய்யுங்கள், உங்கள் Instagram பக்கத்தை உண்மையான ஆன்லைன் ஸ்டோராக மாற்றுங்கள்.',
    heroSubcopy: 'உண்மையான ஸ்டோர்ஃப்ரண்ட், உண்மையான செக்அவுட், உங்கள் சொந்த டொமைன் — வெயிட்லிஸ்டில் சேருங்கள், Instastarz திறந்தவுடன் நாங்கள் உங்களுக்கு மின்னஞ்சல் அனுப்புவோம்.',
    handlePlaceholder: 'உங்கள் Instagram ஹேண்டில் (விருப்பம்)',
    joinButton: 'வெயிட்லிஸ்டில் சேருங்கள் →',
    joiningButton: 'சேர்கிறது...',
    noSpamNote: 'ஸ்பாம் இல்லவே இல்லை. நாங்கள் திறக்கும்போது ஒரே ஒரு மின்னஞ்சல் மட்டும்.',
    successTitle: 'நீங்கள் பட்டியலில் இருக்கிறீர்கள் 🎉',
    successBody: 'உங்கள் இன்பாக்ஸைப் பாருங்கள் — நாங்கள் விரைவில் தொடர்பு கொள்வோம்.',
    featuresEyebrow: 'ஆகஸ்ட் 21 முதல் தொடங்கும் அனைத்தும்',
    featuresHeadline: 'முதல் நாளிலிருந்தே உங்களுக்குக் கிடைப்பது இதுதான்.',
    closingHeadline: 'ஆகஸ்ட் 21ஐ தவறவிடாதீர்கள்.',
    closingDoneMessage: 'நீங்கள் பட்டியலில் இருக்கிறீர்கள் — தொடக்கத்தில் சந்திப்போம் 🎉',
  },
}

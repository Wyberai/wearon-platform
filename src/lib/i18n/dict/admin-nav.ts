import type { Locale } from '../config'

export interface AdminNavDict {
  dashboard: string
  products: string
  orders: string
  inbox: string
  aiStudio: string
  aiBuyer: string
  content: string
  analytics: string
  aiVisibility: string
  customize: string
  settings: string
  discounts: string
  billing: string
  viewStore: string
  signOut: string
}

export const ADMIN_NAV_DICT: Record<Locale, AdminNavDict> = {
  en: {
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    inbox: 'Inbox',
    aiStudio: 'AI Studio',
    aiBuyer: 'AI Buyer',
    content: 'Content',
    analytics: 'Analytics',
    aiVisibility: 'AI Visibility',
    customize: 'Customize',
    settings: 'Settings',
    discounts: 'Discounts',
    billing: 'Billing',
    viewStore: 'View Store',
    signOut: 'Sign Out',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    products: 'उत्पाद',
    orders: 'ऑर्डर',
    inbox: 'इनबॉक्स',
    aiStudio: 'AI स्टूडियो',
    aiBuyer: 'AI बायर',
    content: 'कंटेंट',
    analytics: 'एनालिटिक्स',
    aiVisibility: 'AI विज़िबिलिटी',
    customize: 'कस्टमाइज़',
    settings: 'सेटिंग्स',
    discounts: 'छूट',
    billing: 'बिलिंग',
    viewStore: 'स्टोर देखें',
    signOut: 'साइन आउट',
  },
  kn: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    products: 'ಉತ್ಪನ್ನಗಳು',
    orders: 'ಆರ್ಡರ್‌ಗಳು',
    inbox: 'ಇನ್‌ಬಾಕ್ಸ್',
    aiStudio: 'AI ಸ್ಟುಡಿಯೋ',
    aiBuyer: 'AI ಬಯರ್',
    content: 'ಕಂಟೆಂಟ್',
    analytics: 'ಅನಾಲಿಟಿಕ್ಸ್',
    aiVisibility: 'AI ವಿಸಿಬಿಲಿಟಿ',
    customize: 'ಕಸ್ಟಮೈಸ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    discounts: 'ರಿಯಾಯಿತಿಗಳು',
    billing: 'ಬಿಲ್ಲಿಂಗ್',
    viewStore: 'ಸ್ಟೋರ್ ನೋಡಿ',
    signOut: 'ಸೈನ್ ಔಟ್',
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్',
    products: 'ఉత్పత్తులు',
    orders: 'ఆర్డర్లు',
    inbox: 'ఇన్‌బాక్స్',
    aiStudio: 'AI స్టూడియో',
    aiBuyer: 'AI బయ్యర్',
    content: 'కంటెంట్',
    analytics: 'అనలిటిక్స్',
    aiVisibility: 'AI విజిబిలిటీ',
    customize: 'కస్టమైజ్',
    settings: 'సెట్టింగ్‌లు',
    discounts: 'డిస్కౌంట్‌లు',
    billing: 'బిల్లింగ్',
    viewStore: 'స్టోర్ చూడండి',
    signOut: 'సైన్ అవుట్',
  },
  mr: {
    dashboard: 'डॅशबोर्ड',
    products: 'उत्पादने',
    orders: 'ऑर्डर्स',
    inbox: 'इनबॉक्स',
    aiStudio: 'AI स्टुडिओ',
    aiBuyer: 'AI बायर',
    content: 'कंटेंट',
    analytics: 'अ‍ॅनालिटिक्स',
    aiVisibility: 'AI व्हिजिबिलिटी',
    customize: 'कस्टमाइझ',
    settings: 'सेटिंग्ज',
    discounts: 'सवलती',
    billing: 'बिलिंग',
    viewStore: 'स्टोअर पाहा',
    signOut: 'साइन आउट',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    products: 'பொருட்கள்',
    orders: 'ஆர்டர்கள்',
    inbox: 'இன்பாக்ஸ்',
    aiStudio: 'AI ஸ்டூடியோ',
    aiBuyer: 'AI பயர்',
    content: 'உள்ளடக்கம்',
    analytics: 'பகுப்பாய்வு',
    aiVisibility: 'AI விசிபிலிட்டி',
    customize: 'தனிப்பயனாக்கு',
    settings: 'அமைப்புகள்',
    discounts: 'தள்ளுபடிகள்',
    billing: 'பில்லிங்',
    viewStore: 'ஸ்டோரைப் பார்க்கவும்',
    signOut: 'வெளியேறு',
  },
}

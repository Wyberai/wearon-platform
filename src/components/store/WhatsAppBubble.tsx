// Floating chat affordance for the storefront homepage — separate from the
// small header "Chat with us" link, which is easy to miss (text hidden on
// mobile) and not the pattern buyers actually expect from a boutique site.
export function WhatsAppBubble({ phone, message }: { phone: string; message: string }) {
  return (
    <a
      href={`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 60,
        width: 56, height: 56, borderRadius: '50%', background: '#25D366',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.28)',
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden>
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.83 14.02c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.34-.14-.2-1.17-1.55-1.17-2.96 0-1.4.73-2.09 1-2.38.27-.28.58-.35.78-.35.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.85 2.08.92 2.23.08.15.13.32.03.51-.1.19-.15.31-.3.48-.15.17-.31.37-.44.5-.15.14-.3.3-.13.59.17.29.77 1.27 1.66 2.06 1.14 1.02 2.11 1.33 2.41 1.48.3.15.47.13.65-.05.18-.19.75-.87.95-1.17.2-.3.4-.24.66-.14.27.09 1.71.81 2 .95.29.15.48.22.55.35.07.13.07.72-.17 1.4z"/>
      </svg>
    </a>
  )
}

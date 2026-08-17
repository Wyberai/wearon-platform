// Hand-authored vector mark (boutique storefront: scalloped awning over a
// doorway) — not an AI-raster approximation, so it stays crisp at any size
// from a 16px favicon up. Built from simple rects/arcs rather than one
// complex path, since that geometry is easy to verify by construction
// instead of by eye.
export function BrandLogo({ size = 24, ink = '#111010', accent = '#A6134A' }: { size?: number; ink?: string; accent?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Awning: flat top, rounded top corners, scalloped valance along the bottom */}
      <path
        d="M 20 35
           A 10 10 0 0 0 40 35
           A 10 10 0 0 0 60 35
           A 10 10 0 0 0 80 35
           L 80 20
           Q 80 15 75 15
           L 25 15
           Q 20 15 20 20
           Z"
        fill={ink}
      />
      {/* Side panels */}
      <rect x="22" y="48" width="14" height="27" rx="6" fill={ink} />
      <rect x="64" y="48" width="14" height="27" rx="6" fill={ink} />
      {/* Door (rounded arch) */}
      <path d="M 42 75 L 42 58 A 8 8 0 0 1 58 58 L 58 75 Z" fill={ink} />
      {/* Door handle accent */}
      <circle cx="52" cy="66" r="3" fill={accent} />
    </svg>
  )
}

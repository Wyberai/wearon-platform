import { BRAND } from '@/lib/brand'

// Hand-authored vector mark (boutique storefront: scalloped awning over a
// doorway) — not an AI-raster approximation, so it stays crisp at any size
// from a 16px favicon up. Built from simple rects/arcs rather than one
// complex path, since that geometry is easy to verify by construction
// instead of by eye. Colors come from lib/brand.ts, shared with icon.tsx.
export function BrandLogo({
  size = 24,
  ink = BRAND.ink,
  accent = BRAND.accent,
  animated = false,
}: {
  size?: number
  ink?: string
  accent?: string
  animated?: boolean
}) {
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
      {/* Door (rounded arch, plain — no handle dot) */}
      <path d="M 42 75 L 42 58 A 8 8 0 0 1 58 58 L 58 75 Z" fill={ink} />
      {/* Sparkle accent — orbits the storefront when animated, otherwise sits fixed beside the awning */}
      <path d="M 84 10 L 86.26 15.74 L 92 18 L 86.26 20.26 L 84 26 L 81.74 20.26 L 76 18 L 81.74 15.74 Z" fill={accent}>
        {animated && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 45"
            to="360 50 45"
            dur="3.5s"
            repeatCount="indefinite"
          />
        )}
      </path>
    </svg>
  )
}

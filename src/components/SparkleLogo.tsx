// Hand-authored vector mark — not an AI-raster approximation, so it stays
// crisp at any size (16px favicon through a large hero mark). Shape:
// a four-pointed sparkle built from cubic Beziers whose control points
// pull in tight near the center, giving the same concave-curve "sparkle"
// silhouette as the chosen AI concept (logo-concept-star-camera-refined-v1),
// redrawn as real geometry instead of a fixed-resolution bitmap.
export function SparkleLogo({ size = 24, ink = '#111010', accent = '#A6134A' }: { size?: number; ink?: string; accent?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 4
           C 53 30 58 42 50 50
           C 58 58 63 68 96 50
           C 63 58 58 63 50 96
           C 58 63 53 58 50 50
           C 42 58 37 63 4 50
           C 37 42 42 30 50 4
           Z"
        fill={ink}
      />
      <path
        d="M67 33 C 68.5 40 71 42.5 78 44 C 71 45.5 68.5 48 67 55 C 65.5 48 63 45.5 56 44 C 63 42.5 65.5 40 67 33 Z"
        fill={accent}
      />
    </svg>
  )
}

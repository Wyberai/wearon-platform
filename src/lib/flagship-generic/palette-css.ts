import type { FlagshipPalette } from './types'

// Simple relative-luminance check so accent-ink (text drawn on top of the
// accent color, e.g. button labels) always reads — same problem every
// bespoke theme's hand-picked --x-accent-ink solves per-brand.
function isDark(hex: string): boolean {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.55
}

// Builds the exact --fg-* custom-property set every Generic* component reads,
// as a React inline-style object — mirrors the .{prefix}-root class each
// bespoke theme defines in globals.css, just computed at render time instead
// of hand-authored per brand.
export function flagshipCssVars(palette: FlagshipPalette, font: string): React.CSSProperties {
  const inkIsDark = isDark(palette.ink)
  const accentIsDark = isDark(palette.accent)
  return {
    '--fg-bg': palette.bg,
    '--fg-ink': palette.ink,
    '--fg-ink-muted': inkIsDark ? `${palette.ink}99` : `${palette.ink}99`,
    '--fg-ink-dim': `${palette.ink}66`,
    '--fg-card': palette.card,
    '--fg-line': `${palette.ink}22`,
    '--fg-accent': palette.accent,
    '--fg-accent-ink': accentIsDark ? '#FFFFFF' : '#111111',
    '--fg-glass': `${palette.bg}CC`,
    '--fg-font': `'${font}', sans-serif`,
    background: 'var(--fg-bg)',
    color: 'var(--fg-ink)',
    fontFamily: 'var(--fg-font)',
    minHeight: '100vh',
  } as React.CSSProperties
}

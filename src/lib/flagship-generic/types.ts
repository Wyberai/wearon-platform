// Shared shapes for the generic flagship-tier build system — a reusable
// component kit (Shell/Header/Footer/ProductCard/ShopGrid/Home/PDP/
// CartDrawer/Checkout, all styled purely off CSS custom properties, exactly
// like AugustShell/EmberShell/etc. already do with --a-*/--e-* vars) plus a
// small library of real interactive "signature mechanics", so each new
// flagship brand differs in identity (name/palette/font/catalog) and
// mechanic choice rather than needing its own hand-written component tree.
// This is what makes scaling past the first 12 bespoke themes tractable
// without repeating a whole Shell+PDP+Cart+Checkout build per brand.
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'

export type MechanicType = 'stylist' | 'quiz' | 'countdown' | 'loyalty'

export interface FlagshipPalette {
  bg: string
  ink: string
  accent: string
  card: string
}

export interface FlagshipEntry {
  slug: string
  brand: ThemeBrand
  products: ThemeProduct[]
  palette: FlagshipPalette
  font: string // Google Fonts family name, e.g. 'Fraunces'
  headingWeight: number
  mechanic: MechanicType
  mechanicLabel: string // e.g. "Ask the Stylist", "Find My Fit"
  mechanicIntro: string
}

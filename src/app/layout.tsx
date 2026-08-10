import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'WearOn — Your Branded Boutique App for Instagram Sellers',
  description: 'Give your Instagram buyers a proper branded fashion store — your logo, your colors, WhatsApp ordering. Live in 10 minutes. Free.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

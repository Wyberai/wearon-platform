import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', weight: ['400', '500', '600'], style: ['normal', 'italic'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'WearOn — Your Branded Boutique App for Instagram Sellers',
  description: 'Give your Instagram buyers a proper branded fashion store — your logo, your colors, WhatsApp ordering. Live in 10 minutes. Free.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

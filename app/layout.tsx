import type { Metadata } from 'next'
import { Playfair_Display, Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const _playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' })
const _geist = Geist({ subsets: ["latin"], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'Luxury Event RSVP',
  description: 'RSVP to our exclusive event',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_playfair.variable} ${_geist.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-background text-foreground">
        {children}
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

// src/app/layout.tsx
import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? 'https://decorisa.com.br'),
  title: {
    default: 'Decorisa — Decoração Artesanal em Concreto e Design',
    template: '%s | Decorisa',
  },
  description:
    'Peças artesanais sofisticadas em concreto feitas sob demanda. Design contemporâneo, acabamento premium, exclusividade em cada detalhe.',
  keywords: [
    'decoração artesanal',
    'concreto artesanal',
    'vasos de concreto',
    'decoração premium',
    'design minimalista',
    'peças únicas',
    'decorisa',
  ],
  authors: [{ name: 'Decorisa' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://decorisa.com.br',
    siteName: 'Decorisa',
    title: 'Decorisa — Decoração Artesanal em Concreto e Design',
    description:
      'Peças artesanais sofisticadas em concreto feitas sob demanda. Design contemporâneo, acabamento premium.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Decorisa — Decoração Artesanal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Decorisa — Decoração Artesanal em Concreto',
    description: 'Peças artesanais sofisticadas em concreto feitas sob demanda.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1A1714',
                color: '#FAF8F4',
                borderRadius: '0',
                fontFamily: 'Jost, sans-serif',
                fontSize: '13px',
                letterSpacing: '0.05em',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}

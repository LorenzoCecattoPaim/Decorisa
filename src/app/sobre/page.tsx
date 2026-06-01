// src/app/sobre/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'Sobre a Decorisa',
  description: 'Conheça a história, os valores e o processo artesanal por trás de cada peça Decorisa.',
}

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="nav-offset">
        <AboutPageClient />
      </main>
      <Footer />
    </>
  )
}

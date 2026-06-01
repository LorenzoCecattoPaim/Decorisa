// src/app/contato/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContatoClient from './ContatoClient'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com a Decorisa. Atendimento via WhatsApp, e-mail ou formulário.',
}

export default function ContatoPage() {
  return (
    <>
      <Header />
      <main className="nav-offset">
        <ContatoClient />
      </main>
      <Footer />
    </>
  )
}

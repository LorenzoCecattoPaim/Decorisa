'use client'
// src/app/carrinho/page.tsx
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartPageContent from './CartPageContent'

export default function CarrinhoPage() {
  return (
    <>
      <Header />
      <main className="nav-offset">
        <CartPageContent />
      </main>
      <Footer />
    </>
  )
}

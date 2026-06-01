'use client'
// src/app/checkout/page.tsx
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CheckoutForm from './CheckoutForm'

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="nav-offset">
        <CheckoutForm />
      </main>
      <Footer />
    </>
  )
}

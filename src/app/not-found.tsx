// src/app/not-found.tsx
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="nav-offset min-h-[70vh] flex items-center justify-center text-center px-6">
        <div>
          <p className="font-serif text-[8rem] font-light text-sand leading-none">404</p>
          <h1 className="font-serif text-[2.5rem] font-light text-ink mt-2 mb-4">
            Página não <em className="italic text-accent">encontrada</em>
          </h1>
          <p className="text-[14px] text-warm font-light mb-10 max-w-sm mx-auto">
            A página que você está procurando não existe ou foi movida.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="btn-primary">Voltar ao início</Link>
            <Link href="/loja" className="btn-outline">Ver Loja</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

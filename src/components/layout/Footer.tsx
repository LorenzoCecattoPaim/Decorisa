// src/components/layout/Footer.tsx
import Link from 'next/link'
import { Instagram, MessageCircle, Pinterest } from 'lucide-react'

const shopLinks = [
  { href: '/loja?categoria=vasos', label: 'Vasos' },
  { href: '/loja?categoria=bandejas', label: 'Bandejas' },
  { href: '/loja?categoria=cachepots', label: 'Cachepôs' },
  { href: '/loja?categoria=kits', label: 'Kits' },
  { href: '/loja?categoria=personalizados', label: 'Personalizados' },
]

const brandLinks = [
  { href: '/sobre', label: 'Sobre nós' },
  { href: '/sobre#processo', label: 'Processo artesanal' },
  { href: '/blog', label: 'Blog' },
  { href: '/contato', label: 'Contato' },
]

const helpLinks = [
  { href: '/faq', label: 'Perguntas frequentes' },
  { href: '/trocas', label: 'Trocas e devoluções' },
  { href: '/entrega', label: 'Prazos de entrega' },
  { href: '/cuidados', label: 'Cuidados com as peças' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      {/* Main */}
      <div className="px-8 lg:px-[60px] pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-serif text-[24px] tracking-[0.18em] uppercase text-cream block mb-5">
              Decor<em className="not-italic text-stone">isa</em>
            </Link>
            <p className="text-[13px] leading-[1.8] text-stone font-light max-w-[240px]">
              Decoração artesanal em concreto e design. Objetos únicos produzidos sob demanda.
            </p>
            <div className="flex gap-5 mt-8">
              <a
                href="https://instagram.com/decorisa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone hover:text-cream transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://wa.me/5551999990000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone hover:text-cream transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Loja */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-stone mb-5 font-normal">Loja</h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-white/40 hover:text-cream transition-colors duration-300 font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marca */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-stone mb-5 font-normal">Marca</h4>
            <ul className="space-y-3">
              {brandLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-white/40 hover:text-cream transition-colors duration-300 font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-stone mb-5 font-normal">Atendimento</h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-white/40 hover:text-cream transition-colors duration-300 font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-white/8">
              <p className="text-[11px] text-stone/70 mb-1">Segunda a sexta, 9h–18h</p>
              <a href="https://wa.me/5551999990000" className="text-[13px] text-stone hover:text-cream transition-colors">
                (51) 9 9999-0000
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-white/25 tracking-[0.05em]">
            © {new Date().getFullYear()} Decorisa. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacidade" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">
              Termos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

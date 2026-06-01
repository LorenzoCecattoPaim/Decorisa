'use client'
// src/components/layout/Header.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react'
import { useCartStore } from '@/context/cart-store'
import { cn } from '@/utils'
import CartDrawer from '@/components/cart/CartDrawer'

const navLinks = [
  { href: '/loja', label: 'Loja' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
]

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = pathname === '/'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled || !isHome
            ? 'bg-cream/95 backdrop-blur-md border-b border-sand'
            : 'bg-transparent'
        )}
      >
        <div className="flex items-center justify-between h-20 px-8 lg:px-[60px]">
          {/* Logo */}
          <Link href="/" className="font-serif text-[26px] tracking-[0.18em] uppercase text-ink">
            Decor<em className="not-italic text-accent">isa</em>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[11px] tracking-[0.22em] uppercase transition-colors duration-300',
                  pathname.startsWith(link.href)
                    ? 'text-accent'
                    : 'text-charcoal hover:text-ink'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5">
            <button
              className="text-charcoal hover:text-ink transition-colors duration-300 hidden lg:block"
              aria-label="Buscar"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            <Link
              href="/cliente"
              className="text-charcoal hover:text-ink transition-colors duration-300 hidden lg:block"
              aria-label="Minha conta"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative text-charcoal hover:text-ink transition-colors duration-300"
              aria-label="Carrinho"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-cream text-[9px] flex items-center justify-center rounded-full"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden text-charcoal hover:text-ink transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-cream border-t border-sand overflow-hidden"
            >
              <nav className="flex flex-col py-6 px-8 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-[11px] tracking-[0.22em] uppercase text-charcoal py-3 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/cliente"
                  onClick={() => setMobileOpen(false)}
                  className="text-[11px] tracking-[0.22em] uppercase text-charcoal py-3 hover:text-accent transition-colors"
                >
                  Minha Conta
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

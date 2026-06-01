'use client'
// src/components/admin/AdminShell.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3, Package, ShoppingCart, Users,
  Tag, Image as ImageIcon, Settings, LogOut,
} from 'lucide-react'
import { cn } from '@/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3, exact: true },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/cupons', label: 'Cupons', icon: Tag },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[240px] bg-ink flex-shrink-0 flex flex-col fixed top-0 left-0 h-full z-40">
        <div className="px-8 pt-10 pb-8 border-b border-white/8">
          <Link href="/" className="font-serif text-[18px] tracking-[0.15em] text-cream">
            Decor<span className="text-stone">isa</span>
          </Link>
          <p className="text-[9px] tracking-[0.15em] uppercase text-stone/50 mt-1.5">
            Painel Admin
          </p>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase transition-all duration-200 border-l-2',
                  active
                    ? 'text-cream bg-white/5 border-accent'
                    : 'text-white/40 hover:text-cream hover:bg-white/4 border-transparent'
                )}
              >
                <Icon size={14} strokeWidth={1.5} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-8 py-6 border-t border-white/8">
          <Link
            href="/"
            className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-white/30 hover:text-white/60 transition-colors mb-3"
          >
            Ver Loja →
          </Link>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-white/30 hover:text-white/60 transition-colors"
          >
            <LogOut size={13} strokeWidth={1.5} />
            Sair
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-[240px] bg-cream min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}

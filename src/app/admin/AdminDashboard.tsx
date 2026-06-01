'use client'
// src/app/admin/AdminDashboard.tsx
import Link from 'next/link'
import { BarChart3, Package, ShoppingCart, Users, Tag, Image as ImageIcon, Settings, LogOut, Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { formatPrice, formatDate, getOrderStatusLabel } from '@/utils'
import { cn } from '@/utils'

interface Metrics {
  revenueMonth: number
  revenueMonthDelta: number
  ordersMonth: number
  ordersMonthDelta: number
  avgTicket: number
  topProducts: { name: string; sold: number; revenue: number }[]
  recentOrders: any[]
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/cupons', label: 'Cupons', icon: Tag },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

const statusColors: Record<string, string> = {
  PENDING: 'badge-pending',
  CONFIRMED: 'badge-confirmed',
  IN_PRODUCTION: 'badge badge-production',
  SHIPPED: 'badge-shipped',
  DELIVERED: 'badge-delivered',
  CANCELLED: 'badge-cancelled',
}

export default function AdminDashboard({ metrics }: { metrics: Metrics }) {
  const metricCards = [
    { label: 'Receita do mês', value: formatPrice(metrics.revenueMonth), delta: metrics.revenueMonthDelta, suffix: '%' },
    { label: 'Pedidos', value: String(metrics.ordersMonth), delta: metrics.ordersMonthDelta, suffix: ' vs mês anterior' },
    { label: 'Ticket médio', value: formatPrice(metrics.avgTicket), delta: null },
    { label: 'Top produto', value: metrics.topProducts[0]?.name ?? '—', delta: null },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[240px] bg-ink flex-shrink-0 flex flex-col">
        <div className="px-8 pt-10 pb-8 border-b border-white/8">
          <Link href="/" className="font-serif text-[18px] tracking-[0.15em] text-cream">
            Decor<span className="text-stone">isa</span>
          </Link>
          <p className="text-[9px] tracking-[0.15em] uppercase text-stone/50 mt-1.5">Painel Administrativo</p>
        </div>
        <nav className="flex-1 py-6">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-8 py-3 text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-cream hover:bg-white/4 transition-all duration-200"
            >
              <Icon size={14} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-8 py-6 border-t border-white/8">
          <Link href="/api/auth/signout" className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-white/30 hover:text-white/60 transition-colors">
            <LogOut size={13} strokeWidth={1.5} />
            Sair
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-cream overflow-auto">
        <div className="px-12 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="font-serif text-[2.5rem] font-light text-ink">Dashboard</h1>
              <p className="text-[12px] text-cement mt-1">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <Link href="/admin/produtos/novo" className="btn-primary text-[10px] px-6 py-3 flex items-center gap-2">
              <Plus size={14} strokeWidth={2} />
              Novo Produto
            </Link>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-sand mb-12">
            {metricCards.map((m) => (
              <div key={m.label} className="bg-offwhite px-8 py-8">
                <p className="text-[10px] tracking-[0.25em] uppercase text-cement mb-3">{m.label}</p>
                <p className="font-serif text-[2.2rem] font-light text-ink leading-none mb-2">{m.value}</p>
                {m.delta !== null && (
                  <div className={cn('flex items-center gap-1 text-[12px]', m.delta >= 0 ? 'text-green-700' : 'text-red-600')}>
                    {m.delta >= 0 ? <TrendingUp size={13} strokeWidth={1.5} /> : <TrendingDown size={13} strokeWidth={1.5} />}
                    <span>{m.delta >= 0 ? '+' : ''}{typeof m.delta === 'number' ? m.delta.toFixed(1) : m.delta}{m.suffix}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-[1.6rem] font-light">Últimos Pedidos</h2>
              <Link href="/admin/pedidos" className="text-[11px] tracking-[0.15em] uppercase text-cement hover:text-ink transition-colors">
                Ver todos →
              </Link>
            </div>
            <div className="bg-offwhite overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sand">
                    {['Pedido', 'Cliente', 'Itens', 'Total', 'Status', 'Data'].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-[10px] tracking-[0.22em] uppercase text-cement font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-sand hover:bg-sand/40 transition-colors">
                      <td className="px-5 py-4 text-[13px] font-light">
                        <Link href={`/admin/pedidos/${order.id}`} className="hover:text-accent transition-colors">
                          #{order.number}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-charcoal font-light">{order.user.name}</td>
                      <td className="px-5 py-4 text-[13px] text-charcoal font-light">{order.items.length} item(s)</td>
                      <td className="px-5 py-4 font-serif text-[15px] font-light">{formatPrice(order.total)}</td>
                      <td className="px-5 py-4">
                        <span className={cn('badge text-[9px]', statusColors[order.status] ?? 'badge-pending')}>
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-cement font-light">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-sand">
            {/* Top products */}
            <div className="bg-offwhite px-8 py-8">
              <h3 className="font-serif text-[1.3rem] font-light mb-6">Produtos mais vendidos</h3>
              <div className="space-y-0 divide-y divide-sand">
                {metrics.topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-[1.2rem] font-light text-stone w-5">{i + 1}</span>
                      <span className="text-[13px] text-charcoal font-light">{p.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] text-accent">{p.sold} unid.</p>
                      <p className="text-[11px] text-cement">{formatPrice(p.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-offwhite px-8 py-8">
              <h3 className="font-serif text-[1.3rem] font-light mb-6">Ações rápidas</h3>
              <div className="space-y-3">
                <Link href="/admin/produtos/novo" className="btn-primary w-full justify-center block text-center py-3.5 text-[10px]">+ Novo Produto</Link>
                <Link href="/admin/pedidos?status=IN_PRODUCTION" className="btn-outline w-full justify-center block text-center py-3.5 text-[10px]">Em Produção</Link>
                <Link href="/admin/clientes" className="btn-outline w-full justify-center block text-center py-3.5 text-[10px]">Ver Clientes</Link>
                <Link href="/admin/cupons/novo" className="btn-outline w-full justify-center block text-center py-3.5 text-[10px]">Criar Cupom</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'
// src/app/cliente/ClientArea.tsx
import { useState } from 'react'
import Link from 'next/link'
import { Package, Heart, MapPin, User, LogOut } from 'lucide-react'
import { formatPrice, formatDate, getOrderStatusLabel } from '@/utils'
import { cn } from '@/utils'

type Tab = 'orders' | 'favorites' | 'addresses' | 'profile'

interface Props {
  user: { id: string; name: string; email: string; image?: string }
  orders: any[]
}

const statusColor: Record<string, string> = {
  PENDING: 'badge-pending',
  CONFIRMED: 'badge-confirmed',
  IN_PRODUCTION: 'badge-production',
  SHIPPED: 'badge-shipped',
  DELIVERED: 'badge-delivered',
  CANCELLED: 'badge-cancelled',
}

export default function ClientArea({ user, orders }: Props) {
  const [tab, setTab] = useState<Tab>('orders')

  const navItems = [
    { id: 'orders', label: 'Meus Pedidos', icon: Package },
    { id: 'favorites', label: 'Favoritos', icon: Heart },
    { id: 'addresses', label: 'Endereços', icon: MapPin },
    { id: 'profile', label: 'Meus Dados', icon: User },
  ] as const

  return (
    <div className="section-pad grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
      {/* Sidebar */}
      <aside>
        <div className="bg-offwhite p-8 mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-stone to-cement flex items-center justify-center font-serif text-[1.5rem] text-cream mx-auto mb-4">
            {user.name.charAt(0)}
          </div>
          <p className="font-serif text-[1.3rem] font-light text-ink text-center">{user.name}</p>
          <p className="text-[12px] text-cement text-center mt-1">{user.email}</p>
        </div>
        <nav className="bg-offwhite">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id as Tab)}
              className={cn(
                'w-full flex items-center gap-3 px-8 py-4 text-[11px] tracking-[0.15em] uppercase border-l-2 transition-all duration-200 text-left',
                tab === id
                  ? 'border-accent text-accent bg-sand/30'
                  : 'border-transparent text-charcoal hover:text-ink hover:bg-sand/20'
              )}
            >
              <Icon size={14} strokeWidth={1.5} />
              {label}
            </button>
          ))}
          <Link
            href="/api/auth/signout"
            className="w-full flex items-center gap-3 px-8 py-4 text-[11px] tracking-[0.15em] uppercase text-cement hover:text-ink transition-colors border-l-2 border-transparent"
          >
            <LogOut size={14} strokeWidth={1.5} />
            Sair
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <div>
        {/* Orders */}
        {tab === 'orders' && (
          <div>
            <h1 className="font-serif text-[2rem] font-light text-ink mb-8">
              Meus <em className="italic text-accent">Pedidos</em>
            </h1>
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-offwhite">
                <Package size={40} strokeWidth={1} className="text-stone mx-auto mb-4" />
                <p className="font-serif text-[1.4rem] font-light">Nenhum pedido ainda</p>
                <p className="text-[13px] text-cement mt-2 mb-8">Explore nossa coleção e faça seu primeiro pedido.</p>
                <Link href="/loja" className="btn-primary">Explorar Loja</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {orders.map((order) => (
                  <div key={order.id} className="bg-offwhite p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="font-serif text-[1.1rem] font-light text-ink">Pedido #{order.number}</p>
                        <p className="text-[12px] text-cement mt-0.5">{formatDate(order.createdAt)}</p>
                      </div>
                      <span className={cn('badge text-[10px]', statusColor[order.status])}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-[13px] text-warm font-light mb-4">
                      {order.items.map((i: any) => `${i.name} × ${i.quantity}`).join(' · ')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-[1.3rem] font-light">{formatPrice(order.total)}</span>
                      <Link href={`/pedido/${order.id}`} className="text-[11px] tracking-[0.15em] uppercase text-cement hover:text-ink transition-colors">
                        Ver detalhes →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites placeholder */}
        {tab === 'favorites' && (
          <div>
            <h1 className="font-serif text-[2rem] font-light text-ink mb-8">
              Meus <em className="italic text-accent">Favoritos</em>
            </h1>
            <div className="text-center py-16 bg-offwhite">
              <Heart size={40} strokeWidth={1} className="text-stone mx-auto mb-4" />
              <p className="font-serif text-[1.4rem] font-light">Nenhum favorito ainda</p>
              <p className="text-[13px] text-cement mt-2 mb-8">Salve as peças que você ama.</p>
              <Link href="/loja" className="btn-primary">Explorar Loja</Link>
            </div>
          </div>
        )}

        {/* Addresses placeholder */}
        {tab === 'addresses' && (
          <div>
            <h1 className="font-serif text-[2rem] font-light text-ink mb-8">
              Meus <em className="italic text-accent">Endereços</em>
            </h1>
            <div className="text-center py-16 bg-offwhite">
              <MapPin size={40} strokeWidth={1} className="text-stone mx-auto mb-4" />
              <p className="font-serif text-[1.4rem] font-light">Nenhum endereço salvo</p>
              <p className="text-[13px] text-cement mt-2 mb-8">Seus endereços de entrega aparecerão aqui.</p>
            </div>
          </div>
        )}

        {/* Profile */}
        {tab === 'profile' && (
          <div>
            <h1 className="font-serif text-[2rem] font-light text-ink mb-8">
              Meus <em className="italic text-accent">Dados</em>
            </h1>
            <div className="bg-offwhite p-8 max-w-lg space-y-5">
              <div>
                <label className="form-label">Nome</label>
                <input defaultValue={user.name} className="form-input" />
              </div>
              <div>
                <label className="form-label">E-mail</label>
                <input defaultValue={user.email} type="email" className="form-input" readOnly />
              </div>
              <div>
                <label className="form-label">Telefone</label>
                <input placeholder="(51) 9 0000-0000" className="form-input" />
              </div>
              <div>
                <label className="form-label">Nova senha</label>
                <input type="password" placeholder="••••••••" className="form-input" />
              </div>
              <button className="btn-primary py-3.5 text-[10px] px-10">Salvar alterações</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

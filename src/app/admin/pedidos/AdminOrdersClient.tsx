'use client'
// src/app/admin/pedidos/AdminOrdersClient.tsx
import { useState } from 'react'
import { formatPrice, formatDate, getOrderStatusLabel, getPaymentMethodLabel } from '@/utils'
import { cn } from '@/utils'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = [
  'PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED', 'CANCELLED',
]

const statusColor: Record<string, string> = {
  PENDING: 'badge-pending',
  CONFIRMED: 'badge-confirmed',
  IN_PRODUCTION: 'badge-production',
  SHIPPED: 'badge-shipped',
  DELIVERED: 'badge-delivered',
  CANCELLED: 'badge-cancelled',
}

export default function AdminOrdersClient({ orders: initialOrders }: { orders: any[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const filtered = orders.filter((o) => {
    if (filter !== 'ALL' && o.status !== filter) return false
    if (search && !o.number.includes(search) && !o.user.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/pedidos/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o))
        toast.success('Status atualizado')
      }
    } catch {
      toast.error('Erro ao atualizar status')
    }
  }

  return (
    <div className="px-12 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-[2.5rem] font-light text-ink">Pedidos</h1>
        <span className="text-[12px] text-cement">{filtered.length} pedidos</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {['ALL', ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'px-5 py-2 text-[10px] tracking-[0.18em] uppercase border transition-all duration-200',
              filter === s ? 'bg-ink text-cream border-ink' : 'text-charcoal border-sand hover:border-ink'
            )}
          >
            {s === 'ALL' ? 'Todos' : getOrderStatusLabel(s)}
          </button>
        ))}
        <input
          type="text"
          placeholder="Buscar por nº ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto px-4 py-2 bg-offwhite border border-sand text-[13px] outline-none focus:border-accent w-56 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-offwhite overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sand">
              {['Nº Pedido', 'Cliente', 'Itens', 'Pagamento', 'Total', 'Status', 'Data', 'Ação'].map((h) => (
                <th key={h} className="px-5 py-4 text-left text-[10px] tracking-[0.2em] uppercase text-cement font-normal whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center text-cement font-light text-[14px]">
                  Nenhum pedido encontrado
                </td>
              </tr>
            ) : filtered.map((order) => (
              <tr key={order.id} className="border-b border-sand hover:bg-sand/30 transition-colors">
                <td className="px-5 py-4 text-[13px] font-light text-accent">#{order.number}</td>
                <td className="px-5 py-4">
                  <p className="text-[13px] font-light text-ink">{order.user.name}</p>
                  <p className="text-[11px] text-cement">{order.user.email}</p>
                </td>
                <td className="px-5 py-4 text-[13px] text-charcoal font-light">{order.items.length}x</td>
                <td className="px-5 py-4 text-[12px] text-cement">{getPaymentMethodLabel(order.paymentMethod)}</td>
                <td className="px-5 py-4 font-serif text-[15px] font-light">{formatPrice(order.total)}</td>
                <td className="px-5 py-4">
                  <span className={cn('badge text-[9px]', statusColor[order.status] ?? 'badge-pending')}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-5 py-4 text-[12px] text-cement font-light whitespace-nowrap">{formatDate(order.createdAt)}</td>
                <td className="px-5 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-[10px] tracking-[0.1em] uppercase bg-cream border border-sand px-2 py-1.5 outline-none focus:border-accent cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{getOrderStatusLabel(s)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

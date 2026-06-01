'use client'
// src/app/admin/cupons/AdminCuponsClient.tsx
import { useState, type FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { formatDate } from '@/utils'
import { cn } from '@/utils'
import toast from 'react-hot-toast'

interface Coupon {
  id: string; code: string; description?: string | null; type: string
  value: number; usageLimit?: number | null; usageCount: number
  active: boolean; expiresAt?: string | null; createdAt: string
}

export default function AdminCuponsClient({ cupons: initial }: { cupons: Coupon[] }) {
  const [cupons, setCupons] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', description: '', type: 'PERCENTAGE', value: '', usageLimit: '', expiresAt: '' })

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/cupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, value: Number(form.value), usageLimit: form.usageLimit ? Number(form.usageLimit) : null }),
    })
    const data = await res.json()
    if (data.success) { setCupons((prev) => [data.data, ...prev]); setShowForm(false); toast.success('Cupom criado!') }
    else toast.error(data.error ?? 'Erro')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir cupom?')) return
    const res = await fetch(`/api/cupons/${id}`, { method: 'DELETE' })
    if (res.ok) { setCupons((prev) => prev.filter((c) => c.id !== id)); toast.success('Cupom excluído') }
  }

  const toggleActive = async (c: Coupon) => {
    const res = await fetch(`/api/cupons/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !c.active }) })
    if (res.ok) setCupons((prev) => prev.map((x) => x.id === c.id ? { ...x, active: !x.active } : x))
  }

  return (
    <div className="px-12 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-[2.5rem] font-light text-ink">Cupons</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary text-[10px] px-6 py-3 flex items-center gap-2">
          <Plus size={14} strokeWidth={2} /> Novo Cupom
        </button>
      </div>

      <div className="bg-offwhite overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sand">
              {['Código', 'Tipo', 'Valor', 'Usos', 'Validade', 'Status', 'Ações'].map((h) => (
                <th key={h} className="px-5 py-4 text-left text-[10px] tracking-[0.2em] uppercase text-cement font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cupons.map((c) => (
              <tr key={c.id} className="border-b border-sand hover:bg-sand/30 transition-colors">
                <td className="px-5 py-4">
                  <p className="text-[13px] font-mono font-light tracking-wider text-ink">{c.code}</p>
                  {c.description && <p className="text-[11px] text-cement">{c.description}</p>}
                </td>
                <td className="px-5 py-4 text-[12px] text-charcoal font-light">{c.type === 'PERCENTAGE' ? 'Percentual' : 'Fixo'}</td>
                <td className="px-5 py-4 font-serif text-[15px] font-light">{c.type === 'PERCENTAGE' ? `${c.value}%` : `R$ ${c.value}`}</td>
                <td className="px-5 py-4 text-[13px] text-charcoal font-light">{c.usageCount}/{c.usageLimit ?? '∞'}</td>
                <td className="px-5 py-4 text-[12px] text-charcoal font-light">{c.expiresAt ? formatDate(c.expiresAt) : 'Sem vencimento'}</td>
                <td className="px-5 py-4">
                  <span className={cn('badge text-[9px]', c.active ? 'badge-delivered' : 'badge-cancelled')}>
                    {c.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-5 py-4 flex items-center gap-2">
                  <button onClick={() => toggleActive(c)} className={cn('text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 border transition-colors', c.active ? 'border-sand text-cement hover:border-ink hover:text-ink' : 'border-accent text-accent hover:bg-accent hover:text-cream')}>
                    {c.active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="text-stone hover:text-red-600 transition-colors">
                    <Trash2 size={15} strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-cream w-full max-w-md">
            <div className="flex items-center justify-between px-8 py-6 border-b border-sand">
              <h2 className="font-serif text-[1.4rem] font-light">Novo Cupom</h2>
              <button onClick={() => setShowForm(false)} className="text-cement hover:text-ink text-xl">×</button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-4">
              <div><label className="form-label">Código</label><input required className="form-input uppercase" placeholder="BEMVINDO10" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></div>
              <div><label className="form-label">Descrição</label><input className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Tipo</label>
                  <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="PERCENTAGE">Percentual (%)</option>
                    <option value="FIXED">Valor fixo (R$)</option>
                  </select>
                </div>
                <div><label className="form-label">Valor</label><input required type="number" className="form-input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
                <div><label className="form-label">Limite de usos</label><input type="number" className="form-input" placeholder="Ilimitado" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} /></div>
                <div><label className="form-label">Validade</label><input type="date" className="form-input" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary px-8 py-3.5 text-[10px]">Criar Cupom</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-8 py-3.5 text-[10px]">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

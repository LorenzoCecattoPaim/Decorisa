'use client'
// src/app/admin/banners/BannersPageWrapper.tsx
import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { formatDate } from '@/utils'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'

interface Banner {
  id: string; title: string; subtitle?: string | null; imageUrl: string
  link?: string | null; active: boolean; order: number; createdAt: string
}

export default function BannersPageWrapper() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', link: '', buttonText: '' })

  useEffect(() => {
    fetch('/api/banners').then((r) => r.json()).then((d) => { if (d.success) setBanners(d.data) }).finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { setBanners((prev) => [data.data, ...prev]); setShowForm(false); toast.success('Banner criado!') }
    else toast.error(data.error ?? 'Erro')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir banner?')) return
    const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' })
    if (res.ok) { setBanners((prev) => prev.filter((b) => b.id !== id)); toast.success('Banner excluído') }
  }

  const toggleActive = async (b: Banner) => {
    const res = await fetch(`/api/banners/${b.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !b.active }) })
    if (res.ok) setBanners((prev) => prev.map((x) => x.id === b.id ? { ...x, active: !x.active } : x))
  }

  return (
    <AdminShell>
      <div className="px-12 py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-serif text-[2.5rem] font-light text-ink">Banners</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary text-[10px] px-6 py-3 flex items-center gap-2">
            <Plus size={14} strokeWidth={2} /> Novo Banner
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-sand">
            {[1,2].map((i) => <div key={i} className="skeleton h-48 bg-offwhite" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {banners.map((b) => (
              <div key={b.id} className="bg-offwhite flex items-center gap-6 p-5">
                <div className="w-32 h-20 bg-sand flex-shrink-0 relative overflow-hidden">
                  {b.imageUrl && <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-[17px] font-light text-ink">{b.title}</p>
                  {b.subtitle && <p className="text-[12px] text-cement mt-0.5">{b.subtitle}</p>}
                  {b.link && <p className="text-[11px] text-accent mt-1 truncate">{b.link}</p>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[11px] text-cement">{formatDate(b.createdAt)}</span>
                  <button onClick={() => toggleActive(b)} className="text-charcoal hover:text-accent transition-colors">
                    {b.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="text-stone hover:text-red-600 transition-colors">
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
            {banners.length === 0 && (
              <div className="text-center py-16 bg-offwhite">
                <p className="font-serif text-[1.4rem] font-light text-ink">Nenhum banner cadastrado</p>
              </div>
            )}
          </div>
        )}

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-cream w-full max-w-lg">
              <div className="flex items-center justify-between px-8 py-6 border-b border-sand">
                <h2 className="font-serif text-[1.4rem] font-light">Novo Banner</h2>
                <button onClick={() => setShowForm(false)} className="text-cement hover:text-ink text-xl">×</button>
              </div>
              <form onSubmit={handleCreate} className="p-8 space-y-4">
                <div><label className="form-label">Título</label><input required className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><label className="form-label">Subtítulo</label><input className="form-input" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
                <div><label className="form-label">URL da imagem</label><input required className="form-input" placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
                <div><label className="form-label">Link (opcional)</label><input className="form-input" placeholder="/loja" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></div>
                <div><label className="form-label">Texto do botão</label><input className="form-input" placeholder="Explorar Coleção" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} /></div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary px-8 py-3.5 text-[10px]">Criar Banner</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-8 py-3.5 text-[10px]">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}

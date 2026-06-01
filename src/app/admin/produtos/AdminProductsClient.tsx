'use client'
// src/app/admin/produtos/AdminProductsClient.tsx
import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { formatPrice } from '@/utils'
import { cn } from '@/utils'
import toast from 'react-hot-toast'

interface Product {
  id: string; name: string; slug: string; price: number; comparePrice?: number | null
  stock: number; featured: boolean; active: boolean; category: { name: string }
  images: { url: string }[]
}

interface Category { id: string; name: string; slug: string }

export default function AdminProductsClient({
  products: initialProducts,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    name: '', description: '', shortDesc: '', price: '', comparePrice: '',
    stock: '', categoryId: '', featured: false, productionDays: '10',
    weight: '', materials: '', finishes: '',
  })

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', description: '', shortDesc: '', price: '', comparePrice: '', stock: '', categoryId: categories[0]?.id ?? '', featured: false, productionDays: '10', weight: '', materials: '', finishes: '' })
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name, description: '', shortDesc: '', price: String(p.price),
      comparePrice: p.comparePrice ? String(p.comparePrice) : '',
      stock: String(p.stock), categoryId: '', featured: p.featured,
      productionDays: '10', weight: '', materials: '', finishes: '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
      stock: Number(form.stock),
      productionDays: Number(form.productionDays),
      weight: form.weight ? Number(form.weight) : null,
      materials: form.materials.split(',').map((s) => s.trim()).filter(Boolean),
      finishes: form.finishes.split(',').map((s) => s.trim()).filter(Boolean),
    }
    try {
      const res = await fetch(editing ? `/api/produtos/${editing.id}` : '/api/produtos', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(editing ? 'Produto atualizado!' : 'Produto criado!')
        setShowForm(false)
        if (!editing) setProducts((prev) => [data.data, ...prev])
        else setProducts((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...data.data } : p))
      } else {
        toast.error(data.error ?? 'Erro ao salvar')
      }
    } catch {
      toast.error('Erro ao salvar produto')
    }
  }

  const toggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/produtos/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !product.active }),
      })
      if (res.ok) {
        setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, active: !p.active } : p))
        toast.success(product.active ? 'Produto ocultado' : 'Produto ativado')
      }
    } catch { toast.error('Erro') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este produto?')) return
    try {
      const res = await fetch(`/api/produtos/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        toast.success('Produto excluído')
      }
    } catch { toast.error('Erro ao excluir') }
  }

  return (
    <div className="px-12 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-[2.5rem] font-light text-ink">Produtos</h1>
        <button onClick={openNew} className="btn-primary text-[10px] px-6 py-3 flex items-center gap-2">
          <Plus size={14} strokeWidth={2} /> Novo Produto
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar produto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-input max-w-xs mb-8"
      />

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-sand">
        {filtered.map((p) => (
          <div key={p.id} className={cn('bg-offwhite group', !p.active && 'opacity-50')}>
            <div className="relative h-48 bg-sand overflow-hidden">
              {p.images[0] ? (
                <Image src={p.images[0].url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-stone to-cement" />
              )}
              <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleActive(p)} className="w-7 h-7 bg-cream flex items-center justify-center hover:bg-ink hover:text-cream transition-colors">
                  {p.active ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
                <button onClick={() => openEdit(p)} className="w-7 h-7 bg-cream flex items-center justify-center hover:bg-accent hover:text-cream transition-colors">
                  <Pencil size={12} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="w-7 h-7 bg-cream flex items-center justify-center hover:bg-red-600 hover:text-cream transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
              {p.featured && (
                <span className="absolute top-3 left-3 bg-accent text-cream text-[9px] tracking-[0.15em] uppercase px-2 py-0.5">
                  Destaque
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="text-[10px] tracking-[0.15em] uppercase text-cement mb-1">{p.category.name}</p>
              <p className="font-serif text-[17px] font-light text-ink mb-1 truncate">{p.name}</p>
              <div className="flex items-center justify-between">
                <span className="font-serif text-[18px] font-light">{formatPrice(p.price)}</span>
                <span className={cn('text-[10px] tracking-[0.1em] uppercase', p.stock > 0 ? 'text-green-700' : 'text-red-600')}>
                  {p.stock > 0 ? `${p.stock} em estoque` : 'Esgotado'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-cream w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 py-6 border-b border-sand">
              <h2 className="font-serif text-[1.5rem] font-light">{editing ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={() => setShowForm(false)} className="text-cement hover:text-ink text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="form-label">Nome do produto</label>
                  <input required className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Descrição completa</label>
                  <textarea required className="form-input" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Descrição curta</label>
                  <input className="form-input" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Preço (R$)</label>
                  <input required type="number" step="0.01" className="form-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Preço original (opcional)</label>
                  <input type="number" step="0.01" className="form-input" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Estoque</label>
                  <input required type="number" className="form-input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Prazo produção (dias)</label>
                  <input type="number" className="form-input" value={form.productionDays} onChange={(e) => setForm({ ...form, productionDays: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Categoria</label>
                  <select required className="form-input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">Selecionar...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Peso (kg)</label>
                  <input type="number" step="0.01" className="form-input" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Materiais (separados por vírgula)</label>
                  <input className="form-input" placeholder="Concreto artesanal, Pigmento natural" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Acabamentos (separados por vírgula)</label>
                  <input className="form-input" placeholder="Fosco selado, Acetinado" value={form.finishes} onChange={(e) => setForm({ ...form, finishes: e.target.value })} />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-accent" />
                  <label htmlFor="featured" className="text-[13px] text-charcoal font-light">Destacar na homepage</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary px-8 py-3.5 text-[10px]">
                  {editing ? 'Salvar alterações' : 'Criar produto'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-8 py-3.5 text-[10px]">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

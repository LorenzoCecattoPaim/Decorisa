'use client'
// src/app/loja/CatalogClient.tsx
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/shop/ProductCard'
import { staggerContainer, fadeUp } from '@/animations/variants'
import { ProductWithRelations } from '@/types'
import { formatPrice } from '@/utils'

interface Props {
  products: ProductWithRelations[]
  categories: { id: string; name: string; slug: string }[]
}

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular'

export default function CatalogClient({ products, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = [...products]

    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category.slug === activeCategory)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }

    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        list.sort((a, b) => (b.reviews?.length ?? 0) - (a.reviews?.length ?? 0))
        break
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return list
  }, [products, activeCategory, search, sort])

  return (
    <>
      {/* Page header */}
      <div className="px-8 lg:px-[60px] pt-14 pb-10 bg-offwhite border-b border-sand">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <p className="label-eyebrow mb-3">Coleção Completa</p>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-light text-ink">
            Loja <em className="italic text-accent">Decorisa</em>
          </h1>
        </motion.div>

        {/* Filters bar */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Category filters */}
          <div className="flex flex-wrap gap-0">
            {[{ slug: 'all', name: 'Todos' }, ...categories].map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-6 py-3 text-[10px] tracking-[0.22em] uppercase border-y border-r first:border-l transition-all duration-300 font-sans ${
                  activeCategory === cat.slug
                    ? 'bg-ink text-cream border-ink'
                    : 'bg-transparent text-charcoal border-sand hover:bg-ink hover:text-cream hover:border-ink'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cement" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Buscar peças..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-3 bg-cream border border-sand text-[13px] text-ink placeholder-stone outline-none focus:border-accent w-52 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-cement hover:text-ink">
                  <X size={12} />
                </button>
              )}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-4 py-3 bg-cream border border-sand text-[11px] tracking-[0.1em] uppercase text-charcoal outline-none focus:border-accent cursor-pointer"
            >
              <option value="newest">Mais recentes</option>
              <option value="popular">Mais populares</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="px-8 lg:px-[60px] py-5 border-b border-sand bg-cream">
        <p className="text-[12px] text-cement tracking-[0.08em]">
          {filtered.length} {filtered.length === 1 ? 'peça encontrada' : 'peças encontradas'}
        </p>
      </div>

      {/* Grid */}
      <div className="bg-cream px-8 lg:px-[60px] py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-[2rem] font-light text-ink mb-3">Nenhuma peça encontrada</p>
            <p className="text-[14px] text-cement">Tente outros filtros ou busque por outro termo.</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearch('') }}
              className="btn-outline mt-8"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-sand"
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </>
  )
}

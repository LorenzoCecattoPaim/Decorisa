// src/hooks/useProducts.ts
import { useState, useEffect } from 'react'
import { ProductWithRelations, FilterParams } from '@/types'

export function useProducts(filters: FilterParams = {}) {
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.page) params.set('page', String(filters.page))
    if (filters.limit) params.set('limit', String(filters.limit))
    if (filters.category) params.set('category', filters.category)
    if (filters.search) params.set('search', filters.search)
    if (filters.featured !== undefined) params.set('featured', String(filters.featured))

    setLoading(true)
    fetch(`/api/produtos?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) { setProducts(d.data); setTotal(d.total) }
        else setError(d.error ?? 'Erro ao carregar produtos')
      })
      .catch(() => setError('Erro ao carregar produtos'))
      .finally(() => setLoading(false))
  }, [filters.page, filters.limit, filters.category, filters.search, filters.featured])

  return { products, total, loading, error }
}

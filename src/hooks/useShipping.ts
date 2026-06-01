// src/hooks/useShipping.ts
import { useState, useCallback } from 'react'
import { ShippingOption } from '@/types'

export function useShipping() {
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculate = useCallback(async (state: string, total: number) => {
    if (!state) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/frete?state=${state}&total=${total}`)
      const data = await res.json()
      if (data.success) setOptions(data.data)
      else setError(data.error ?? 'Erro ao calcular frete')
    } catch {
      setError('Erro ao calcular frete')
    } finally {
      setLoading(false)
    }
  }, [])

  return { options, loading, error, calculate }
}

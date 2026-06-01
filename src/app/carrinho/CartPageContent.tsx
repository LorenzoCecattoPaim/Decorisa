'use client'
// src/app/carrinho/CartPageContent.tsx
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trash2, Tag, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/context/cart-store'
import { formatPrice } from '@/utils'
import { fadeUp } from '@/animations/variants'
import toast from 'react-hot-toast'

export default function CartPageContent() {
  const { items, subtotal, discount, shippingCost, total, removeItem, updateQuantity, applyCoupon, removeCoupon, coupon } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const res = await fetch(`/api/cupons/validate?code=${couponCode}`)
      const data = await res.json()
      if (data.success) {
        applyCoupon({ id: data.data.id, code: data.data.code, type: data.data.type, value: data.data.value, discount: 0 })
        toast.success('Cupom aplicado com sucesso!')
      } else {
        toast.error(data.error ?? 'Cupom inválido')
      }
    } catch {
      toast.error('Erro ao validar cupom')
    } finally {
      setCouponLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="section-pad flex flex-col items-center justify-center text-center min-h-[60vh]">
        <ShoppingBag size={56} strokeWidth={1} className="text-stone mb-6" />
        <h1 className="font-serif text-[2.5rem] font-light text-ink mb-3">Carrinho vazio</h1>
        <p className="text-[14px] text-cement font-light mb-10">Explore nossa coleção e encontre a peça perfeita.</p>
        <Link href="/loja" className="btn-primary">Explorar Loja</Link>
      </div>
    )
  }

  return (
    <div className="section-pad">
      <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className="font-serif text-[clamp(2.2rem,4vw,3.5rem)] font-light text-ink mb-12">
        Meu <em className="italic text-accent">Carrinho</em>
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-14">
        {/* Items */}
        <div>
          <div className="divide-y divide-sand">
            {items.map((item) => {
              const price = item.variant?.price ?? item.product.price
              const image = item.product.images?.[0]?.url
              return (
                <div key={item.id} className="py-7 flex gap-6 items-center">
                  <div className="w-24 h-28 bg-sand flex-shrink-0 relative overflow-hidden">
                    {image ? (
                      <Image src={image} alt={item.product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-stone to-cement" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/produto/${item.product.slug}`} className="font-serif text-[20px] font-light text-ink hover:text-accent transition-colors block mb-1">
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-[11px] text-cement tracking-[0.08em] mb-3">
                        {item.variant.name}: {item.variant.value}
                      </p>
                    )}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center border border-sand">
                        <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center text-charcoal hover:text-ink text-lg">−</button>
                        <span className="w-9 text-center text-[14px]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center text-charcoal hover:text-ink text-lg">+</button>
                      </div>
                      <span className="font-serif text-[20px] font-light">{formatPrice(price * item.quantity)}</span>
                    </div>
                  </div>
                  <button onClick={() => { removeItem(item.productId, item.variantId); toast('Item removido') }} className="text-stone hover:text-accent transition-colors flex-shrink-0">
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Coupon */}
          <div className="mt-8 pt-8 border-t border-sand">
            <p className="form-label mb-3">Cupom de desconto</p>
            {coupon ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-3 bg-offwhite border border-sand">
                  <Tag size={13} strokeWidth={1.5} className="text-accent" />
                  <span className="text-[13px] tracking-[0.1em] font-light">{coupon.code}</span>
                  <span className="text-[12px] text-accent">−{formatPrice(discount)}</span>
                </div>
                <button onClick={() => { removeCoupon(); setCouponCode('') }} className="text-[11px] tracking-[0.15em] uppercase text-cement hover:text-ink transition-colors">
                  Remover
                </button>
              </div>
            ) : (
              <div className="flex gap-0 max-w-sm">
                <input
                  type="text"
                  placeholder="Código do cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="form-input flex-1"
                />
                <button onClick={handleApplyCoupon} disabled={couponLoading} className="px-6 bg-ink text-cream text-[11px] tracking-[0.15em] uppercase hover:bg-accent transition-colors disabled:opacity-50 whitespace-nowrap">
                  {couponLoading ? '...' : 'Aplicar'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-offwhite p-8 h-fit">
          <h2 className="font-serif text-[1.6rem] font-light text-ink mb-7">Resumo do pedido</h2>
          <div className="space-y-3 mb-6 divide-y divide-sand">
            <div className="flex justify-between text-[13px] pb-3">
              <span className="text-charcoal font-light">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[13px] pt-3 pb-3">
                <span className="text-accent font-light">Desconto</span>
                <span className="text-accent">− {formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[13px] pt-3 pb-3">
              <span className="text-charcoal font-light">Frete</span>
              <span className="text-accent text-[12px] tracking-[0.08em]">Calcular no checkout</span>
            </div>
          </div>
          <div className="flex justify-between items-baseline pt-4 border-t border-sand mb-7">
            <span className="font-serif text-[1.4rem] font-light">Total</span>
            <span className="font-serif text-[1.8rem] font-light">{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className="btn-primary w-full justify-center block text-center py-4">
            Finalizar Compra
          </Link>
          <Link href="/loja" className="block text-center text-[11px] tracking-[0.18em] uppercase text-cement hover:text-ink transition-colors mt-4 py-2">
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'
// src/components/cart/CartDrawer.tsx
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingBag, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/context/cart-store'
import { formatPrice } from '@/utils'
import { drawerSlide, overlayFade } from '@/animations/variants'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, subtotal, total, discount, shippingCost, removeItem, updateQuantity } = useCartStore()

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-cream z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-sand">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-ink" />
                <span className="font-serif text-[22px] font-light">
                  Carrinho
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-cement hover:text-ink transition-colors"
                aria-label="Fechar"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={40} strokeWidth={1} className="text-stone mb-4" />
                  <p className="font-serif text-[20px] font-light text-ink mb-2">
                    Carrinho vazio
                  </p>
                  <p className="text-[13px] text-cement font-light mb-8">
                    Explore nossa coleção e encontre a peça perfeita.
                  </p>
                  <button onClick={onClose} className="btn-primary text-[10px] px-8 py-3">
                    Explorar Loja
                  </button>
                </div>
              ) : (
                <ul className="space-y-0 divide-y divide-sand">
                  {items.map((item) => {
                    const price = item.variant?.price ?? item.product.price
                    const image = item.product.images?.[0]?.url

                    return (
                      <li key={item.id} className="py-6 flex gap-4">
                        {/* Image */}
                        <div className="w-20 h-24 bg-sand flex-shrink-0 overflow-hidden relative">
                          {image ? (
                            <Image src={image} alt={item.product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-stone to-cement" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/produto/${item.product.slug}`}
                            onClick={onClose}
                            className="font-serif text-[17px] font-light text-ink hover:text-accent transition-colors leading-tight block mb-1"
                          >
                            {item.product.name}
                          </Link>
                          {item.variant && (
                            <p className="text-[11px] text-cement tracking-[0.08em] mb-3">
                              {item.variant.name}: {item.variant.value}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            {/* Qty */}
                            <div className="flex items-center border border-sand">
                              <button
                                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-charcoal hover:text-ink text-lg transition-colors"
                              >
                                −
                              </button>
                              <span className="w-8 text-center text-[13px]">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-charcoal hover:text-ink text-lg transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-serif text-[18px] font-light">
                                {formatPrice(price * item.quantity)}
                              </span>
                              <button
                                onClick={() => removeItem(item.productId, item.variantId)}
                                className="text-stone hover:text-accent transition-colors"
                                aria-label="Remover"
                              >
                                <Trash2 size={14} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Summary + CTA */}
            {items.length > 0 && (
              <div className="border-t border-sand px-8 py-6 bg-offwhite">
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-[13px] text-charcoal">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[13px] text-accent">
                      <span>Desconto</span>
                      <span>− {formatPrice(discount)}</span>
                    </div>
                  )}
                  {shippingCost > 0 && (
                    <div className="flex justify-between text-[13px] text-charcoal">
                      <span>Frete</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-sand">
                    <span className="font-serif text-[20px] font-light">Total</span>
                    <span className="font-serif text-[20px] font-light">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link href="/checkout" onClick={onClose} className="btn-primary w-full text-center block py-4 text-[11px]">
                  Finalizar Compra
                </Link>
                <button
                  onClick={onClose}
                  className="w-full text-center text-[11px] tracking-[0.18em] uppercase text-cement hover:text-ink transition-colors mt-3 py-2"
                >
                  Continuar comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

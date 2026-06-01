// src/context/cart-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItemState, CartState, CouponState } from '@/types'

interface CartStore extends CartState {
  addItem: (item: Omit<CartItemState, 'id'>) => void
  removeItem: (productId: string, variantId?: string | null) => void
  updateQuantity: (productId: string, variantId: string | null | undefined, quantity: number) => void
  applyCoupon: (coupon: CouponState) => void
  removeCoupon: () => void
  setShipping: (cost: number) => void
  clearCart: () => void
  itemCount: () => number
}

const calcTotals = (items: CartItemState[], coupon?: CouponState | null, shippingCost = 0) => {
  const subtotal = items.reduce((acc, item) => {
    const price = item.variant?.price ?? item.product.price
    return acc + price * item.quantity
  }, 0)

  let discount = 0
  if (coupon) {
    if (coupon.type === 'PERCENTAGE') {
      discount = (subtotal * coupon.value) / 100
    } else {
      discount = Math.min(coupon.value, subtotal)
    }
  }

  const total = Math.max(0, subtotal - discount + shippingCost)
  return { subtotal, discount, total }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      shippingCost: 0,
      subtotal: 0,
      discount: 0,
      total: 0,

      addItem: (newItem) => {
        const { items, coupon, shippingCost } = get()
        const existing = items.find(
          (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
        )

        let updatedItems: CartItemState[]
        if (existing) {
          updatedItems = items.map((i) =>
            i.productId === newItem.productId && i.variantId === newItem.variantId
              ? { ...i, quantity: i.quantity + newItem.quantity }
              : i
          )
        } else {
          updatedItems = [
            ...items,
            { ...newItem, id: `${newItem.productId}-${newItem.variantId ?? 'default'}-${Date.now()}` },
          ]
        }

        const totals = calcTotals(updatedItems, coupon, shippingCost)
        set({ items: updatedItems, ...totals })
      },

      removeItem: (productId, variantId) => {
        const { items, coupon, shippingCost } = get()
        const updatedItems = items.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        )
        const totals = calcTotals(updatedItems, coupon, shippingCost)
        set({ items: updatedItems, ...totals })
      },

      updateQuantity: (productId, variantId, quantity) => {
        const { items, coupon, shippingCost } = get()
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }
        const updatedItems = items.map((i) =>
          i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
        )
        const totals = calcTotals(updatedItems, coupon, shippingCost)
        set({ items: updatedItems, ...totals })
      },

      applyCoupon: (coupon) => {
        const { items, shippingCost } = get()
        const totals = calcTotals(items, coupon, shippingCost)
        set({ coupon, ...totals })
      },

      removeCoupon: () => {
        const { items, shippingCost } = get()
        const totals = calcTotals(items, null, shippingCost)
        set({ coupon: null, ...totals })
      },

      setShipping: (cost) => {
        const { items, coupon } = get()
        const totals = calcTotals(items, coupon, cost)
        set({ shippingCost: cost, ...totals })
      },

      clearCart: () => {
        set({ items: [], coupon: null, shippingCost: 0, subtotal: 0, discount: 0, total: 0 })
      },

      itemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0)
      },
    }),
    {
      name: 'decorisa-cart',
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        shippingCost: state.shippingCost,
        subtotal: state.subtotal,
        discount: state.discount,
        total: state.total,
      }),
    }
  )
)

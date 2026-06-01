'use client'
// src/components/shop/ProductCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { ProductWithRelations } from '@/types'
import { formatPrice, getAverageRating } from '@/utils'
import { useCartStore } from '@/context/cart-store'
import { staggerItem } from '@/animations/variants'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: ProductWithRelations
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [favorited, setFavorited] = useState(false)
  const [imageIdx, setImageIdx] = useState(0)
  const addItem = useCartStore((s) => s.addItem)

  const mainImage = product.images[imageIdx]?.url
  const hoverImage = product.images[1]?.url
  const avg = getAverageRating(product.reviews)
  const discountPct = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      variantId: null,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
      },
    })
    toast.success(`${product.name} adicionado ao carrinho`)
  }

  return (
    <motion.div variants={staggerItem} className="product-card group">
      <Link href={`/produto/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-product bg-offwhite">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              priority={priority}
              className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
              onMouseEnter={() => hoverImage && setImageIdx(1)}
              onMouseLeave={() => setImageIdx(0)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-stone/60 to-cement/80" />
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-ink text-cream text-[9px] tracking-[0.2em] uppercase px-3 py-1">
                Destaque
              </span>
            )}
            {discountPct && (
              <span className="bg-accent text-cream text-[9px] tracking-[0.2em] uppercase px-3 py-1">
                −{discountPct}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-charcoal text-cream text-[9px] tracking-[0.2em] uppercase px-3 py-1">
                Esgotado
              </span>
            )}
          </div>

          {/* Favorite */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setFavorited(!favorited)
              toast(favorited ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
            }}
            className="absolute top-4 right-4 w-9 h-9 bg-cream/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cream"
            aria-label="Favoritar"
          >
            <Heart
              size={15}
              strokeWidth={1.5}
              className={favorited ? 'fill-accent text-accent' : 'text-charcoal'}
            />
          </button>

          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-premium">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-3.5 bg-ink text-cream text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 pb-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-cement mb-1.5">
            {product.category.name}
          </p>
          <h3 className="font-serif text-[20px] font-light text-ink mb-1 leading-tight group-hover:text-accent transition-colors duration-300">
            {product.name}
          </h3>
          {product.shortDesc && (
            <p className="text-[12px] text-warm font-light leading-relaxed mb-3 line-clamp-2">
              {product.shortDesc}
            </p>
          )}

          {/* Rating */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`text-[11px] ${s <= Math.round(avg) ? 'text-accent' : 'text-stone'}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-cement">({product.reviews.length})</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="font-serif text-[22px] font-light text-ink">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-[14px] text-stone line-through font-light">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

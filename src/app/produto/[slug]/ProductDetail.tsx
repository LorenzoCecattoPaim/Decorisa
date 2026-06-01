'use client'
// src/app/produto/[slug]/ProductDetail.tsx
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, MessageCircle, ChevronRight, Star } from 'lucide-react'
import { useCartStore } from '@/context/cart-store'
import { ProductWithRelations } from '@/types'
import { formatPrice, getAverageRating } from '@/utils'
import ProductCard from '@/components/shop/ProductCard'
import { fadeUp, staggerContainer, staggerItem } from '@/animations/variants'
import toast from 'react-hot-toast'

interface Props {
  product: ProductWithRelations
  related: ProductWithRelations[]
}

export default function ProductDetail({ product, related }: Props) {
  const [activeImg, setActiveImg] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [qty, setQty] = useState(1)
  const [favorited, setFavorited] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const avg = getAverageRating(product.reviews)

  // Group variants by name
  const variantGroups = product.variants.reduce<Record<string, typeof product.variants>>(
    (acc, v) => {
      if (!acc[v.name]) acc[v.name] = []
      acc[v.name].push(v)
      return acc
    },
    {}
  )

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: null,
      quantity: qty,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        images: product.images.map((i) => ({ url: i.url, alt: i.alt })),
      },
    })
    toast.success(`${product.name} adicionado ao carrinho`)
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="px-8 lg:px-[60px] py-4 border-b border-sand bg-offwhite">
        <nav className="flex items-center gap-2 text-[11px] text-cement tracking-[0.08em]">
          <Link href="/" className="hover:text-ink transition-colors">Início</Link>
          <ChevronRight size={12} />
          <Link href="/loja" className="hover:text-ink transition-colors">Loja</Link>
          <ChevronRight size={12} />
          <Link href={`/loja?categoria=${product.category.slug}`} className="hover:text-ink transition-colors">
            {product.category.name}
          </Link>
          <ChevronRight size={12} />
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      {/* Main layout */}
      <div className="px-8 lg:px-[60px] py-14 grid grid-cols-1 lg:grid-cols-[55%_1fr] gap-16 lg:gap-20">
        {/* Gallery */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex flex-col gap-2 w-20 flex-shrink-0">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 relative overflow-hidden transition-all duration-300 ${
                    i === activeImg ? 'ring-2 ring-ink' : 'ring-1 ring-sand hover:ring-cement'
                  }`}
                >
                  <Image src={img.url} alt={img.alt ?? product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="flex-1 relative bg-offwhite overflow-hidden" style={{ aspectRatio: '3/4' }}>
            {product.images[activeImg] ? (
              <Image
                src={product.images[activeImg].url}
                alt={product.images[activeImg].alt ?? product.name}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone to-cement" />
            )}
          </div>
        </div>

        {/* Info */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="py-2">
          <p className="label-eyebrow mb-3">{product.category.name}</p>
          <h1 className="font-serif text-[clamp(2rem,3.5vw,3rem)] font-light text-ink leading-tight mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={13} strokeWidth={0} className={s <= Math.round(avg) ? 'fill-accent' : 'fill-stone'} />
                ))}
              </div>
              <span className="text-[12px] text-cement">
                {avg} ({product.reviews.length} avaliações)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-serif text-[2.2rem] font-light text-ink">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-[16px] text-stone line-through font-light">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          <p className="text-[14px] leading-[1.9] text-warm font-light mb-7">
            {product.description}
          </p>

          {/* Artisan note */}
          <div className="border-l-2 border-accent pl-5 py-2 mb-7 bg-offwhite pr-5">
            <p className="font-serif text-[15px] italic text-warm leading-[1.65]">
              "Cada peça é produzida artesanalmente após sua encomenda, tornando cada item único e exclusivo."
            </p>
          </div>

          {/* Variants */}
          {Object.entries(variantGroups).map(([groupName, variants]) => (
            <div key={groupName} className="mb-6">
              <p className="form-label mb-3">{groupName}</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariants((prev) => ({ ...prev, [groupName]: v.id }))}
                    className={`px-4 py-2 text-[12px] tracking-[0.08em] border transition-all duration-200 ${
                      selectedVariants[groupName] === v.id
                        ? 'bg-ink text-cream border-ink'
                        : 'bg-transparent text-charcoal border-sand hover:border-ink'
                    }`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mb-7">
            <p className="form-label mb-3">Quantidade</p>
            <div className="flex items-center gap-5">
              <div className="flex items-center border border-sand">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-11 flex items-center justify-center text-charcoal hover:text-ink text-xl transition-colors"
                >
                  −
                </button>
                <span className="w-11 text-center text-[15px]">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-11 h-11 flex items-center justify-center text-charcoal hover:text-ink text-xl transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-[12px] text-cement">
                Prazo de produção: {product.productionDays} a {product.productionDays + 3} dias úteis
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary w-full justify-center text-[11px] py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={15} strokeWidth={1.5} className="mr-2" />
              {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
            </button>
            <a
              href={`https://wa.me/5551999990000?text=Olá! Tenho interesse no produto: ${product.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#075E54] hover:bg-[#054d44] text-cream text-[11px] tracking-[0.2em] uppercase transition-colors duration-300"
            >
              <MessageCircle size={15} strokeWidth={1.5} />
              Comprar via WhatsApp
            </a>
            <button
              onClick={() => setFavorited(!favorited)}
              className={`flex items-center justify-center gap-2 w-full py-3.5 border text-[11px] tracking-[0.18em] uppercase transition-all duration-300 ${
                favorited ? 'border-accent text-accent' : 'border-sand text-cement hover:border-ink hover:text-ink'
              }`}
            >
              <Heart size={14} strokeWidth={1.5} className={favorited ? 'fill-accent' : ''} />
              {favorited ? 'Salvo nos favoritos' : 'Adicionar aos favoritos'}
            </button>
          </div>

          {/* Tech specs */}
          <div className="grid grid-cols-2 gap-px bg-sand border border-sand">
            {product.materials.length > 0 && (
              <div className="bg-offwhite px-5 py-4">
                <p className="form-label mb-1">Material</p>
                <p className="text-[13px] text-charcoal">{product.materials.join(', ')}</p>
              </div>
            )}
            {product.dimensions && (
              <div className="bg-offwhite px-5 py-4">
                <p className="form-label mb-1">Dimensões</p>
                <p className="text-[13px] text-charcoal">
                  {(product.dimensions as any).width ?? '—'} × {(product.dimensions as any).height ?? '—'} cm
                </p>
              </div>
            )}
            {product.finishes.length > 0 && (
              <div className="bg-offwhite px-5 py-4">
                <p className="form-label mb-1">Acabamento</p>
                <p className="text-[13px] text-charcoal">{product.finishes.join(', ')}</p>
              </div>
            )}
            {product.weight && (
              <div className="bg-offwhite px-5 py-4">
                <p className="form-label mb-1">Peso</p>
                <p className="text-[13px] text-charcoal">{product.weight} kg</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="px-8 lg:px-[60px] py-14 border-t border-sand bg-offwhite">
          <h2 className="font-serif text-[2rem] font-light text-ink mb-10">
            Avaliações <em className="italic text-accent">({product.reviews.length})</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-sand">
            {product.reviews.map((r) => (
              <div key={r.id} className="bg-cream px-8 py-8">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={12} strokeWidth={0} className={s <= r.rating ? 'fill-accent' : 'fill-stone'} />
                  ))}
                </div>
                {r.title && <p className="font-serif text-[17px] font-light mb-2">{r.title}</p>}
                {r.body && <p className="text-[13px] text-warm leading-relaxed font-light mb-5">"{r.body}"</p>}
                <p className="text-[11px] tracking-[0.15em] uppercase text-cement">{r.user.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="px-8 lg:px-[60px] py-14 border-t border-sand">
          <h2 className="font-serif text-[2rem] font-light text-ink mb-10">
            Você também pode <em className="italic text-accent">gostar</em>
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-sand"
          >
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
}

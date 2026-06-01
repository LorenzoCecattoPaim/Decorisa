'use client'
// src/components/shop/FeaturedProducts.tsx
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { staggerContainer, fadeUp } from '@/animations/variants'
import { ProductWithRelations } from '@/types'

interface Props {
  products: ProductWithRelations[]
}

export default function FeaturedProducts({ products }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="section-pad bg-cream">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
      >
        <div>
          <p className="label-eyebrow mb-3">Destaques da Coleção</p>
          <h2 className="section-title">
            Peças <em className="italic text-accent">exclusivas</em>
          </h2>
        </div>
        <Link href="/loja" className="btn-outline self-start md:self-auto">
          Ver Todos
        </Link>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-sand"
      >
        {products.length > 0
          ? products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))
          : /* Skeleton placeholders */
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-offwhite">
                <div className="skeleton aspect-product" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-3 w-20 rounded" />
                  <div className="skeleton h-5 w-40 rounded" />
                  <div className="skeleton h-4 w-24 rounded" />
                </div>
              </div>
            ))}
      </motion.div>
    </section>
  )
}

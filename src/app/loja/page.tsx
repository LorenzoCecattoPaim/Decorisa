// src/app/loja/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CatalogClient from './CatalogClient'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Loja — Coleção Completa',
  description: 'Explore nossa coleção completa de peças artesanais em concreto.',
}

async function getData() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' }, take: 2 },
        variants: true,
        reviews: { where: { approved: true }, select: { rating: true, id: true, userId: true, productId: true, title: true, body: true, approved: true, createdAt: true, updatedAt: true, user: { select: { name: true, avatar: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
  ])
  return { products, categories }
}

export default async function LojaPage() {
  const { products, categories } = await getData()

  return (
    <>
      <Header />
      <main className="nav-offset">
        <CatalogClient products={products as any} categories={categories} />
      </main>
      <Footer />
    </>
  )
}

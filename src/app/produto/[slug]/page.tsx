// src/app/produto/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductDetail from './ProductDetail'
import { prisma } from '@/lib/prisma'

interface Props {
  params: { slug: string }
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, active: true },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
      variants: true,
      reviews: {
        where: { approved: true },
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      },
      relatedFrom: {
        take: 4,
        include: {
          related: {
            include: {
              images: { orderBy: { order: 'asc' }, take: 1 },
              category: true,
              variants: true,
              reviews: { where: { approved: true }, select: { rating: true, id: true, userId: true, productId: true, title: true, body: true, approved: true, createdAt: true, updatedAt: true, user: { select: { name: true, avatar: true } } } },
            },
          },
        },
      },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return { title: 'Produto não encontrado' }
  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDesc ?? product.description.slice(0, 160),
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const related = product.relatedFrom.map((r) => r.related)

  return (
    <>
      <Header />
      <main className="nav-offset">
        <ProductDetail product={product as any} related={related as any} />
      </main>
      <Footer />
    </>
  )
}

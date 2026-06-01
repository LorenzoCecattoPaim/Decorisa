// src/app/page.tsx
import type { Metadata } from 'next'
import HeroSection from '@/components/shop/HeroSection'
import FeaturedProducts from '@/components/shop/FeaturedProducts'
import AboutBand from '@/components/shop/AboutBand'
import {
  ProcessSection,
  DifferentialsSection,
  TestimonialsSection,
  NewsletterSection,
} from '@/components/shop/sections'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Decorisa — Decoração Artesanal em Concreto e Design',
  description: 'Peças artesanais sofisticadas em concreto feitas sob demanda.',
}

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, active: true },
    take: 4,
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
      variants: true,
      reviews: { where: { approved: true }, select: { rating: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts products={featuredProducts as any} />
        <AboutBand />
        <ProcessSection />
        <DifferentialsSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}

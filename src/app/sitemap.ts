// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://decorisa.com.br'

  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  })

  const categories = await prisma.category.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  })

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/loja`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/produto/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/loja?categoria=${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}

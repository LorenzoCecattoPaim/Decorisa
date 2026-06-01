// src/app/admin/produtos/page.tsx
import { prisma } from '@/lib/prisma'
import AdminShell from '@/components/admin/AdminShell'
import AdminProductsClient from './AdminProductsClient'

async function getData() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, images: { orderBy: { order: 'asc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
  ])
  return { products, categories }
}

export default async function AdminProdutosPage() {
  const { products, categories } = await getData()
  return (
    <AdminShell>
      <AdminProductsClient products={products as any} categories={categories} />
    </AdminShell>
  )
}

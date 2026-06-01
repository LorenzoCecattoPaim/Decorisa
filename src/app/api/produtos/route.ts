// src/app/api/produtos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/utils'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 12)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const featured = searchParams.get('featured')

  const where: any = { active: true }
  if (category) where.category = { slug: category }
  if (featured) where.featured = featured === 'true'
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, images: { orderBy: { order: 'asc' }, take: 2 }, variants: true, reviews: { where: { approved: true }, select: { rating: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ success: true, data, total, page, limit, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { name, description, shortDesc, price, comparePrice, stock, categoryId, featured, productionDays, weight, dimensions, materials, finishes, metaTitle, metaDescription } = body

  const product = await prisma.product.create({
    data: {
      name,
      slug: slugify(name),
      description,
      shortDesc,
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : null,
      stock: Number(stock ?? 0),
      categoryId,
      featured: Boolean(featured),
      productionDays: Number(productionDays ?? 10),
      weight: weight ? Number(weight) : null,
      dimensions: dimensions ?? null,
      materials: materials ?? [],
      finishes: finishes ?? [],
      metaTitle,
      metaDescription,
    },
  })

  return NextResponse.json({ success: true, data: product }, { status: 201 })
}

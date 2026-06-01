// src/app/api/pedidos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/utils'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const isAdmin = session.user?.role === 'ADMIN'
  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 20)
  const status = searchParams.get('status')

  const where: any = isAdmin ? {} : { userId: session.user.id }
  if (status) where.status = status

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: { select: { name: true, email: true } }, items: true, address: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ])

  return NextResponse.json({ success: true, data: orders, total, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })

  const body = await req.json()
  const { items, address: addr, paymentMethod, shippingCost, couponId } = body

  if (!items?.length) return NextResponse.json({ success: false, error: 'Carrinho vazio' }, { status: 400 })

  // Create or reuse address
  const address = await prisma.address.create({
    data: {
      userId: session.user.id as string,
      name: addr.name,
      phone: addr.phone,
      zipCode: addr.zipCode,
      street: addr.street,
      number: addr.number,
      complement: addr.complement,
      district: addr.district,
      city: addr.city,
      state: addr.state,
    },
  })

  // Get products
  const productIds = items.map((i: any) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { images: { take: 1, orderBy: { order: 'asc' } } },
  })

  const subtotal = items.reduce((acc: number, item: any) => {
    const p = products.find((pr) => pr.id === item.productId)
    return acc + (p?.price ?? 0) * item.quantity
  }, 0)

  const total = subtotal + (shippingCost ?? 0)

  const order = await prisma.order.create({
    data: {
      number: generateOrderNumber(),
      userId: session.user.id as string,
      addressId: address.id,
      couponId: couponId ?? null,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod,
      subtotal,
      shippingCost: shippingCost ?? 0,
      discount: 0,
      total,
      items: {
        create: items.map((item: any) => {
          const p = products.find((pr) => pr.id === item.productId)
          return {
            productId: item.productId,
            variantId: item.variantId ?? null,
            name: p?.name ?? '',
            price: item.price ?? p?.price ?? 0,
            quantity: item.quantity,
            total: (item.price ?? p?.price ?? 0) * item.quantity,
            image: p?.images?.[0]?.url ?? null,
          }
        }),
      },
      timeline: {
        create: { status: 'PENDING', message: 'Pedido recebido e aguardando confirmação.' },
      },
    },
    include: { items: true },
  })

  return NextResponse.json({ success: true, data: order }, { status: 201 })
}

// src/app/api/pedidos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateDiscount, generateOrderNumber } from '@/utils'

const PAYMENT_METHODS = new Set(['PIX', 'CREDIT_CARD', 'BOLETO', 'MERCADO_PAGO'])

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Nao autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const isAdmin = session.user?.role === 'ADMIN'
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)))
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

  return NextResponse.json({ success: true, data: orders, total, page, limit, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Nao autorizado' }, { status: 401 })

  const body = await req.json()
  const items = Array.isArray(body.items) ? body.items : []
  const addr = body.address ?? {}
  const paymentMethod = String(body.paymentMethod ?? '')
  const shippingCost = Math.max(0, Number(body.shippingCost ?? 0))
  const paymentDiscount = Math.max(0, Number(body.paymentDiscount ?? 0))

  if (!items.length) return NextResponse.json({ success: false, error: 'Carrinho vazio' }, { status: 400 })
  if (!PAYMENT_METHODS.has(paymentMethod)) {
    return NextResponse.json({ success: false, error: 'Forma de pagamento invalida' }, { status: 400 })
  }

  const requiredAddress = ['name', 'phone', 'zipCode', 'street', 'number', 'district', 'city', 'state']
  const missingAddress = requiredAddress.some((field) => !String(addr[field] ?? '').trim())
  if (missingAddress) {
    return NextResponse.json({ success: false, error: 'Endereco incompleto' }, { status: 400 })
  }

  const productIds = items.map((i: any) => String(i.productId ?? '')).filter(Boolean)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
    include: { images: { take: 1, orderBy: { order: 'asc' } }, variants: true },
  })

  if (products.length !== new Set(productIds).size) {
    return NextResponse.json({ success: false, error: 'Produto indisponivel no carrinho' }, { status: 400 })
  }

  const orderItems = items.map((item: any) => {
    const quantity = Math.max(1, Number(item.quantity ?? 1))
    const product = products.find((p) => p.id === item.productId)
    const variant = item.variantId ? product?.variants.find((v) => v.id === item.variantId) : null
    if (!product || (item.variantId && !variant)) return null
    const price = variant?.price ?? product.price
    if (product.trackStock && product.stock < quantity) return null
    if (variant && variant.stock < quantity) return null
    return {
      productId: product.id,
      variantId: variant?.id ?? null,
      name: product.name,
      sku: variant?.sku ?? product.sku ?? null,
      price,
      quantity,
      total: price * quantity,
      image: product.images?.[0]?.url ?? null,
    }
  })

  if (orderItems.some((item) => !item)) {
    return NextResponse.json({ success: false, error: 'Estoque indisponivel' }, { status: 400 })
  }

  const validItems = orderItems.filter(Boolean) as NonNullable<(typeof orderItems)[number]>[]
  const subtotal = validItems.reduce((acc, item) => acc + item.total, 0)

  let couponId: string | null = null
  let couponDiscount = 0
  if (body.couponId) {
    const coupon = await prisma.coupon.findUnique({ where: { id: String(body.couponId) } })
    const now = new Date()
    const isValid =
      coupon &&
      coupon.active &&
      (!coupon.startsAt || coupon.startsAt <= now) &&
      (!coupon.expiresAt || coupon.expiresAt >= now) &&
      (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) &&
      (!coupon.minOrderValue || subtotal >= coupon.minOrderValue)

    if (!isValid) return NextResponse.json({ success: false, error: 'Cupom invalido' }, { status: 400 })

    couponId = coupon.id
    couponDiscount = calculateDiscount(subtotal, coupon.type, coupon.value)
    if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount)
  }

  const allowedPaymentDiscount = paymentMethod === 'PIX' ? subtotal * 0.05 : 0
  const totalPaymentDiscount = Math.min(paymentDiscount, allowedPaymentDiscount)
  const discount = Math.min(subtotal, couponDiscount + totalPaymentDiscount)
  const total = Math.max(0, subtotal - discount + shippingCost)

  const order = await prisma.$transaction(async (tx) => {
    const address = await tx.address.create({
      data: {
        userId: session.user.id,
        name: String(addr.name).trim(),
        phone: String(addr.phone).trim(),
        zipCode: String(addr.zipCode).trim(),
        street: String(addr.street).trim(),
        number: String(addr.number).trim(),
        complement: addr.complement ? String(addr.complement).trim() : null,
        district: String(addr.district).trim(),
        city: String(addr.city).trim(),
        state: String(addr.state).trim().toUpperCase(),
      },
    })

    const created = await tx.order.create({
      data: {
        number: generateOrderNumber(),
        userId: session.user.id,
        addressId: address.id,
        couponId,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: paymentMethod as any,
        subtotal,
        shippingCost,
        discount,
        total,
        items: { create: validItems },
        timeline: { create: { status: 'PENDING', message: 'Pedido recebido e aguardando confirmacao.' } },
      },
      include: { items: true },
    })

    if (couponId) await tx.coupon.update({ where: { id: couponId }, data: { usageCount: { increment: 1 } } })

    const stockUpdates = validItems.flatMap((item) => {
      const product = products.find((p) => p.id === item.productId)
      const updates: Promise<unknown>[] = []
      if (product?.trackStock) {
        updates.push(tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } }))
      }
      if (item.variantId) {
        updates.push(tx.variant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.quantity } } }))
      }
      return updates
    })
    await Promise.all(stockUpdates)

    return created
  })

  return NextResponse.json({ success: true, data: order }, { status: 201 })
}

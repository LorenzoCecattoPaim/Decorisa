// src/app/api/pedidos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true, email: true, phone: true } }, items: true, address: true, timeline: { orderBy: { createdAt: 'asc' } }, coupon: true },
  })
  if (!order) return NextResponse.json({ success: false, error: 'Não encontrado' }, { status: 404 })

  const isAdmin = (session.user as any)?.role === 'ADMIN'
  if (!isAdmin && order.userId !== session.user?.id) {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 403 })
  }
  return NextResponse.json({ success: true, data: order })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { status, trackingCode, trackingUrl, paymentStatus } = body

  const updateData: any = {}
  if (status) {
    updateData.status = status
    if (status === 'SHIPPED') updateData.shippedAt = new Date()
    if (status === 'DELIVERED') updateData.deliveredAt = new Date()
    if (status === 'CANCELLED') updateData.cancelledAt = new Date()
  }
  if (trackingCode) updateData.trackingCode = trackingCode
  if (trackingUrl) updateData.trackingUrl = trackingUrl
  if (paymentStatus) {
    updateData.paymentStatus = paymentStatus
    if (paymentStatus === 'PAID') updateData.paidAt = new Date()
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      ...updateData,
      timeline: status
        ? { create: { status, message: `Status atualizado para: ${status}` } }
        : undefined,
    },
  })
  return NextResponse.json({ success: true, data: order })
}

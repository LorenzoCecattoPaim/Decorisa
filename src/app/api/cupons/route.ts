// src/app/api/cupons/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  }
  const cupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ success: true, data: cupons })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  }
  const body = await req.json()
  const existing = await prisma.coupon.findUnique({ where: { code: body.code } })
  if (existing) return NextResponse.json({ success: false, error: 'Código já existe' }, { status: 409 })

  const coupon = await prisma.coupon.create({
    data: {
      code: body.code.toUpperCase(),
      description: body.description,
      type: body.type ?? 'PERCENTAGE',
      value: Number(body.value),
      usageLimit: body.usageLimit ?? null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      active: true,
    },
  })
  return NextResponse.json({ success: true, data: coupon }, { status: 201 })
}

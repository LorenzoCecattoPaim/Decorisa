// src/app/api/cupons/validate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.json({ success: false, error: 'Código inválido' }, { status: 400 })

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })

  if (!coupon || !coupon.active) return NextResponse.json({ success: false, error: 'Cupom inválido' }, { status: 404 })
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return NextResponse.json({ success: false, error: 'Cupom expirado' }, { status: 400 })
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return NextResponse.json({ success: false, error: 'Cupom esgotado' }, { status: 400 })

  return NextResponse.json({ success: true, data: { id: coupon.id, code: coupon.code, type: coupon.type, value: coupon.value } })
}

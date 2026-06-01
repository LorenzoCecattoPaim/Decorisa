// src/app/api/frete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const state = searchParams.get('state')?.toUpperCase()
  const total = Number(searchParams.get('total') ?? 0)

  if (!state) return NextResponse.json({ success: false, error: 'Estado obrigatório' }, { status: 400 })

  const zones = await prisma.shippingZone.findMany({ where: { active: true } })

  // Match zone
  let matched = zones.find((z) => z.states.includes(state))
  if (!matched) matched = zones.find((z) => z.states.length === 0) // fallback: all states

  if (!matched) {
    return NextResponse.json({ success: true, data: [{ id: 'default', name: 'PAC', price: 45, days: 12 }] })
  }

  const isFree = matched.freeFrom !== null && total >= (matched.freeFrom ?? Infinity)

  return NextResponse.json({
    success: true,
    data: [
      {
        id: matched.id,
        name: matched.name,
        price: isFree ? 0 : matched.price,
        days: matched.days,
        freeFrom: matched.freeFrom,
        isFree,
      },
    ],
  })
}

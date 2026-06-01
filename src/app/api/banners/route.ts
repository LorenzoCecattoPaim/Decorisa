// src/app/api/banners/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json({ success: true, data: banners })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  }
  const body = await req.json()
  const banner = await prisma.banner.create({ data: body })
  return NextResponse.json({ success: true, data: banner }, { status: 201 })
}

// src/app/api/banners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  }
  const body = await req.json()
  const banner = await prisma.banner.update({ where: { id: params.id }, data: body })
  return NextResponse.json({ success: true, data: banner })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  }
  await prisma.banner.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

// src/app/api/produtos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/utils'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true, images: { orderBy: { order: 'asc' } }, variants: true, reviews: { include: { user: { select: { name: true, avatar: true } } } } },
  })
  if (!product) return NextResponse.json({ success: false, error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json({ success: true, data: product })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  }
  const body = await req.json()
  const updateData: any = { ...body }
  if (body.name) updateData.slug = slugify(body.name)
  if (body.price !== undefined) updateData.price = Number(body.price)
  if (body.comparePrice !== undefined) updateData.comparePrice = body.comparePrice ? Number(body.comparePrice) : null
  if (body.stock !== undefined) updateData.stock = Number(body.stock)

  const product = await prisma.product.update({ where: { id: params.id }, data: updateData })
  return NextResponse.json({ success: true, data: product })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  }
  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

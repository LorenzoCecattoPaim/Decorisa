// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ success: false, error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ success: false, error: 'E-mail já cadastrado' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true },
  })

  return NextResponse.json({ success: true, data: user }, { status: 201 })
}

// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()
  const normalizedName = String(name ?? '').trim()
  const normalizedEmail = String(email ?? '').toLowerCase().trim()
  const rawPassword = String(password ?? '')

  if (!normalizedName || !normalizedEmail || !rawPassword) {
    return NextResponse.json({ success: false, error: 'Campos obrigatorios faltando' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return NextResponse.json({ success: false, error: 'E-mail invalido' }, { status: 400 })
  }

  if (rawPassword.length < 8) {
    return NextResponse.json({ success: false, error: 'A senha deve ter no minimo 8 caracteres' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
  if (existing) {
    return NextResponse.json({ success: false, error: 'E-mail ja cadastrado' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(rawPassword, 12)
  const user = await prisma.user.create({
    data: { name: normalizedName, email: normalizedEmail, password: hashed },
    select: { id: true, name: true, email: true },
  })

  return NextResponse.json({ success: true, data: user }, { status: 201 })
}

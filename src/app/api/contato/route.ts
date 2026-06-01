// src/app/api/contato/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()
  const cleanName = String(name ?? '').trim()
  const cleanEmail = String(email ?? '').trim()
  const cleanSubject = String(subject ?? 'Contato pelo site').trim()
  const cleanMessage = String(message ?? '').trim()

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return NextResponse.json({ success: false, error: 'Campos obrigatorios faltando' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return NextResponse.json({ success: false, error: 'E-mail invalido' }, { status: 400 })
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return NextResponse.json({ success: false, error: 'SMTP nao configurado' }, { status: 503 })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })

    await transporter.sendMail({
      from: `"Decorisa Site" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL ?? 'ola@decorisa.com.br',
      replyTo: cleanEmail,
      subject: `[Decorisa Contato] ${cleanSubject}`,
      html: `
        <h2>Nova mensagem via site</h2>
        <p><strong>Nome:</strong> ${escapeHtml(cleanName)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(cleanEmail)}</p>
        <p><strong>Assunto:</strong> ${escapeHtml(cleanSubject)}</p>
        <hr />
        <p>${escapeHtml(cleanMessage).replace(/\n/g, '<br />')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    return NextResponse.json({ success: false, error: 'Erro ao enviar e-mail' }, { status: 500 })
  }
}

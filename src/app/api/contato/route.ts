// src/app/api/contato/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: 'Campos obrigatórios faltando' }, { status: 400 })
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
      replyTo: email,
      subject: `[Decorisa Contato] ${subject}`,
      html: `
        <h2>Nova mensagem via site</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    return NextResponse.json({ success: false, error: 'Erro ao enviar e-mail' }, { status: 500 })
  }
}

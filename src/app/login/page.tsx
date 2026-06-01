'use client'
// src/app/login/page.tsx
import { Suspense, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { fadeUp } from '@/animations/variants'
import toast from 'react-hot-toast'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/cliente'
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { ...form, redirect: false, callbackUrl })
    setLoading(false)
    if (res?.ok) {
      router.push(callbackUrl)
    } else {
      toast.error('E-mail ou senha incorretos')
    }
  }

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="w-full max-w-sm">
        <Link href="/" className="font-serif text-[28px] tracking-[0.18em] uppercase text-ink block text-center mb-12">
          Decor<em className="not-italic text-accent">isa</em>
        </Link>
        <h1 className="font-serif text-[2rem] font-light text-ink text-center mb-2">Entrar</h1>
        <p className="text-[13px] text-cement text-center mb-8 font-light">Acesse sua conta Decorisa</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">E-mail</label>
            <input type="email" required className="form-input" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Senha</label>
            <input type="password" required className="form-input" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="text-right">
            <Link href="/recuperar-senha" className="text-[11px] tracking-[0.1em] text-cement hover:text-ink transition-colors">
              Esqueci minha senha
            </Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 mt-2 disabled:opacity-60">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[13px] text-cement font-light">
            Não tem conta?{' '}
            <Link href="/cadastro" className="text-accent hover:text-warm transition-colors">
              Criar conta
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

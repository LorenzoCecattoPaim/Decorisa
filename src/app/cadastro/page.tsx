'use client'
// src/app/cadastro/page.tsx
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { fadeUp } from '@/animations/variants'
import toast from 'react-hot-toast'

export default function CadastroPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Conta criada! Faça login.')
        router.push('/login')
      } else {
        toast.error(data.error ?? 'Erro ao criar conta')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="w-full max-w-sm">
        <Link href="/" className="font-serif text-[28px] tracking-[0.18em] uppercase text-ink block text-center mb-12">
          Decor<em className="not-italic text-accent">isa</em>
        </Link>
        <h1 className="font-serif text-[2rem] font-light text-ink text-center mb-2">Criar Conta</h1>
        <p className="text-[13px] text-cement text-center mb-8 font-light">Junte-se à família Decorisa</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Nome</label>
            <input type="text" required className="form-input" placeholder="Seu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="form-label">E-mail</label>
            <input type="email" required className="form-input" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Senha</label>
            <input type="password" required minLength={8} className="form-input" placeholder="Minimo 8 caracteres" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Confirmar Senha</label>
            <input type="password" required className="form-input" placeholder="Repita a senha" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 mt-2 disabled:opacity-60">
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[13px] text-cement font-light">
            Já tem conta?{' '}
            <Link href="/login" className="text-accent hover:text-warm transition-colors">Entrar</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

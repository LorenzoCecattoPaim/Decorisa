'use client'
// src/app/contato/ContatoClient.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, MapPin, Clock, Send } from 'lucide-react'
import { fadeUp, slideRight, slideLeft } from '@/animations/variants'
import toast from 'react-hot-toast'

export default function ContatoClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Mensagem enviada com sucesso!')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error('Erro ao enviar. Tente novamente.')
      }
    } catch {
      toast.error('Erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-pad grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
      {/* Info */}
      <motion.div variants={slideRight} initial="hidden" animate="visible">
        <p className="label-eyebrow mb-4">Fale Conosco</p>
        <h1 className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-light leading-tight text-ink mb-10">
          Fale com a<br /><em className="italic text-accent">Decorisa</em>
        </h1>

        <div className="space-y-0 divide-y divide-sand">
          {[
            { icon: MessageCircle, label: 'WhatsApp', content: '(51) 9 9999-0000', href: 'https://wa.me/5551999990000' },
            { icon: Mail, label: 'E-mail', content: 'ola@decorisa.com.br', href: 'mailto:ola@decorisa.com.br' },
            { icon: MapPin, label: 'Localização', content: 'Passo Fundo, RS — Brasil', href: null },
            { icon: Clock, label: 'Horário', content: 'Segunda a sexta, 9h às 18h', href: null },
          ].map(({ icon: Icon, label, content, href }) => (
            <div key={label} className="py-6">
              <div className="flex items-start gap-4">
                <Icon size={18} strokeWidth={1.5} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-cement mb-1">{label}</p>
                  {href ? (
                    <a href={href} className="text-[15px] text-ink hover:text-accent transition-colors font-light">
                      {content}
                    </a>
                  ) : (
                    <p className="text-[15px] text-ink font-light">{content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-3">
          <a
            href="https://wa.me/5551999990000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-[10px] px-8 py-3.5"
          >
            Abrir WhatsApp
          </a>
          <a
            href="https://instagram.com/decorisa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-[10px] px-8 py-3.5"
          >
            Instagram
          </a>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div variants={slideLeft} initial="hidden" animate="visible">
        <h2 className="font-serif text-[1.8rem] font-light text-ink mb-8">Envie uma mensagem</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Nome</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Seu nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">E-mail</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="form-label">Assunto</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="Como posso ajudar?"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Mensagem</label>
            <textarea
              required
              className="form-input"
              placeholder="Sua mensagem..."
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-4 disabled:opacity-60"
          >
            <Send size={14} strokeWidth={1.5} className="mr-2" />
            {loading ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

'use client'
// src/app/checkout/CheckoutForm.tsx
import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useCartStore } from '@/context/cart-store'
import { formatPrice } from '@/utils'
import { fadeUp } from '@/animations/variants'
import { Lock, Zap, CreditCard, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

type PayMethod = 'PIX' | 'CREDIT_CARD' | 'BOLETO'

export default function CheckoutForm() {
  const router = useRouter()
  const { items, coupon, subtotal, discount, total, clearCart } = useCartStore()
  const [step, setStep] = useState<'address' | 'payment'>('address')
  const [loading, setLoading] = useState(false)
  const [payMethod, setPayMethod] = useState<PayMethod>('PIX')

  const [address, setAddress] = useState({
    name: '', email: '', phone: '', document: '',
    zipCode: '', street: '', number: '', complement: '', district: '', city: '', state: '',
  })

  const shipping = 35
  const pixDiscount = payMethod === 'PIX' ? subtotal * 0.05 : 0
  const finalTotal = total + shipping - pixDiscount

  useEffect(() => {
    if (items.length === 0) router.replace('/loja')
  }, [items.length, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (step === 'address') { setStep('payment'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.variant?.price ?? i.product.price,
          })),
          address,
          paymentMethod: payMethod,
          shippingCost: shipping,
          couponId: coupon?.id ?? null,
          paymentDiscount: pixDiscount,
        }),
      })
      const data = await res.json()
      if (data.success) {
        clearCart()
        router.push(`/pedido/${data.data.id}/confirmacao`)
      } else {
        toast.error(data.error ?? 'Erro ao processar pedido')
      }
    } catch {
      toast.error('Erro ao processar pedido')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="section-pad">
      <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-ink mb-12">
        Finalizar <em className="italic text-accent">Pedido</em>
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-14">
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Step indicator */}
          <div className="flex items-center gap-4 mb-10">
            {['address', 'payment'].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center text-[12px] font-sans font-normal transition-colors duration-300 ${step === s || (s === 'address') ? 'bg-ink text-cream' : 'bg-sand text-cement'}`}>
                  {i + 1}
                </div>
                <span className={`text-[11px] tracking-[0.18em] uppercase ${step === s ? 'text-ink' : 'text-cement'}`}>
                  {s === 'address' ? 'Endereço' : 'Pagamento'}
                </span>
                {i === 0 && <div className="w-12 h-px bg-sand" />}
              </div>
            ))}
          </div>

          {/* Address step */}
          {step === 'address' && (
            <div className="space-y-5">
              <h2 className="font-serif text-[1.6rem] font-light mb-6">Dados pessoais e entrega</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Nome completo</label><input required className="form-input" placeholder="Ana Silva" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} /></div>
                <div><label className="form-label">CPF</label><input required className="form-input" placeholder="000.000.000-00" value={address.document} onChange={(e) => setAddress({ ...address, document: e.target.value })} /></div>
                <div><label className="form-label">E-mail</label><input required type="email" className="form-input" placeholder="ana@email.com" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} /></div>
                <div><label className="form-label">Telefone</label><input required className="form-input" placeholder="(51) 9 0000-0000" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} /></div>
                <div><label className="form-label">CEP</label><input required className="form-input" placeholder="99000-000" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} /></div>
                <div />
                <div className="col-span-2"><label className="form-label">Rua</label><input required className="form-input" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} /></div>
                <div><label className="form-label">Número</label><input required className="form-input" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} /></div>
                <div><label className="form-label">Complemento</label><input className="form-input" placeholder="Opcional" value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} /></div>
                <div><label className="form-label">Bairro</label><input required className="form-input" value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} /></div>
                <div><label className="form-label">Cidade</label><input required className="form-input" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /></div>
                <div><label className="form-label">Estado</label><input required className="form-input" placeholder="RS" maxLength={2} value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })} /></div>
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-4 mt-4">
                Continuar para Pagamento
              </button>
            </div>
          )}

          {/* Payment step */}
          {step === 'payment' && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <button type="button" onClick={() => setStep('address')} className="text-[11px] tracking-[0.15em] uppercase text-cement hover:text-ink transition-colors">
                  ← Voltar
                </button>
              </div>
              <h2 className="font-serif text-[1.6rem] font-light mb-6">Forma de pagamento</h2>

              <div className="grid grid-cols-3 gap-px bg-sand mb-8">
                {([
                  { id: 'PIX', label: 'Pix', icon: Zap, note: '5% de desconto' },
                  { id: 'CREDIT_CARD', label: 'Cartão', icon: CreditCard, note: 'Até 6x sem juros' },
                  { id: 'BOLETO', label: 'Boleto', icon: FileText, note: 'Vence em 3 dias' },
                ] as const).map(({ id, label, icon: Icon, note }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPayMethod(id)}
                    className={`py-6 px-4 text-center transition-all duration-300 ${payMethod === id ? 'bg-ink text-cream' : 'bg-cream hover:bg-offwhite text-charcoal'}`}
                  >
                    <Icon size={22} strokeWidth={1.5} className="mx-auto mb-2" />
                    <p className="text-[11px] tracking-[0.15em] uppercase mb-1">{label}</p>
                    <p className={`text-[10px] ${payMethod === id ? 'text-stone' : 'text-cement'}`}>{note}</p>
                  </button>
                ))}
              </div>

              {payMethod === 'PIX' && (
                <div className="bg-offwhite p-6 text-center mb-6">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-cement mb-2">Chave Pix</p>
                  <p className="font-serif text-[1.2rem] font-light">decorisa@pix.com.br</p>
                  <p className="text-[12px] text-accent mt-2">✓ 5% de desconto aplicado automaticamente</p>
                </div>
              )}

              {payMethod === 'CREDIT_CARD' && (
                <div className="space-y-4 mb-6">
                  <div><label className="form-label">Número do cartão</label><input className="form-input" placeholder="0000 0000 0000 0000" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="form-label">Validade</label><input className="form-input" placeholder="MM/AA" /></div>
                    <div><label className="form-label">CVV</label><input className="form-input" placeholder="000" /></div>
                  </div>
                  <div><label className="form-label">Nome no cartão</label><input className="form-input" /></div>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 disabled:opacity-60">
                <Lock size={14} strokeWidth={1.5} className="mr-2" />
                {loading ? 'Processando...' : `Confirmar Pedido — ${formatPrice(finalTotal)}`}
              </button>
              <p className="text-[11px] text-cement text-center mt-4">
                🔒 Pagamento seguro · SSL · Dados protegidos
              </p>
            </div>
          )}
        </form>

        {/* Order summary */}
        <div className="bg-offwhite p-8 h-fit">
          <h3 className="font-serif text-[1.4rem] font-light text-ink mb-6">Resumo</h3>
          <div className="space-y-4 mb-6">
            {items.map((item) => {
              const price = item.variant?.price ?? item.product.price
              const img = item.product.images?.[0]?.url
              return (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-14 h-16 bg-sand flex-shrink-0 relative overflow-hidden">
                    {img ? <Image src={img} alt={item.product.name} fill className="object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-stone to-cement" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-ink font-light truncate">{item.product.name}</p>
                    <p className="text-[11px] text-cement">Qtd: {item.quantity}</p>
                  </div>
                  <span className="text-[14px] font-light">{formatPrice(price * item.quantity)}</span>
                </div>
              )
            })}
          </div>
          <div className="space-y-2 pt-5 border-t border-sand text-[13px]">
            <div className="flex justify-between"><span className="text-charcoal font-light">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-accent"><span>Desconto cupom</span><span>− {formatPrice(discount)}</span></div>}
            {pixDiscount > 0 && <div className="flex justify-between text-accent"><span>Desconto Pix 5%</span><span>− {formatPrice(pixDiscount)}</span></div>}
            <div className="flex justify-between"><span className="text-charcoal font-light">Frete</span><span>{formatPrice(shipping)}</span></div>
          </div>
          <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-sand">
            <span className="font-serif text-[1.3rem] font-light">Total</span>
            <span className="font-serif text-[1.6rem] font-light">{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

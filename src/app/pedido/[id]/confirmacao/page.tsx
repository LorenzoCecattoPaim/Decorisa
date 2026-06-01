// src/app/pedido/[id]/confirmacao/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { formatPrice, formatDate, getOrderStatusLabel, getPaymentMethodLabel } from '@/utils'
import { CheckCircle2 } from 'lucide-react'

async function getOrder(id: string, userId: string) {
  return prisma.order.findFirst({
    where: { id, userId },
    include: { items: true, address: true },
  })
}

export default async function ConfirmacaoPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const order = await getOrder(params.id, session.user?.id as string)
  if (!order) notFound()

  return (
    <>
      <Header />
      <main className="nav-offset section-pad max-w-2xl mx-auto">
        {/* Success header */}
        <div className="text-center mb-14">
          <CheckCircle2 size={52} strokeWidth={1} className="text-green-600 mx-auto mb-5" />
          <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-ink mb-3">
            Pedido <em className="italic text-accent">confirmado!</em>
          </h1>
          <p className="text-[14px] text-warm font-light leading-relaxed">
            Recebemos seu pedido <strong className="font-normal">#{order.number}</strong>.
            Você receberá um e-mail com as informações de produção e entrega.
          </p>
        </div>

        {/* Order summary */}
        <div className="bg-offwhite p-8 mb-6">
          <h2 className="font-serif text-[1.4rem] font-light mb-6">Resumo do pedido</h2>
          <div className="space-y-0 divide-y divide-sand mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-[13px] text-ink font-light">{item.name}</p>
                  <p className="text-[11px] text-cement">Qtd: {item.quantity}</p>
                </div>
                <span className="font-serif text-[15px] font-light">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-4 border-t border-sand text-[13px]">
            <div className="flex justify-between"><span className="text-charcoal font-light">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-accent"><span>Desconto</span><span>− {formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-charcoal font-light">Frete</span><span>{formatPrice(order.shippingCost)}</span></div>
          </div>
          <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-sand">
            <span className="font-serif text-[1.3rem] font-light">Total</span>
            <span className="font-serif text-[1.8rem] font-light">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Order info */}
        <div className="grid grid-cols-2 gap-px bg-sand mb-10">
          {[
            { label: 'Nº do Pedido', value: `#${order.number}` },
            { label: 'Data', value: formatDate(order.createdAt) },
            { label: 'Pagamento', value: getPaymentMethodLabel(order.paymentMethod) },
            { label: 'Status', value: getOrderStatusLabel(order.status) },
          ].map((info) => (
            <div key={info.label} className="bg-offwhite px-6 py-5">
              <p className="text-[10px] tracking-[0.2em] uppercase text-cement mb-1">{info.label}</p>
              <p className="text-[13px] text-ink font-light">{info.value}</p>
            </div>
          ))}
        </div>

        {/* Pix instructions */}
        {order.paymentMethod === 'PIX' && (
          <div className="bg-green-50 border border-green-200 p-6 mb-8 text-center">
            <p className="text-[11px] tracking-[0.2em] uppercase text-green-700 mb-2">Pagamento via Pix</p>
            <p className="font-serif text-[1.3rem] text-green-800 mb-1">decorisa@pix.com.br</p>
            <p className="text-[12px] text-green-700">Realize o pagamento para confirmar a produção da sua peça.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/cliente" className="btn-primary px-10 py-4">
            Acompanhar Pedido
          </Link>
          <Link href="/loja" className="btn-outline px-10 py-4">
            Continuar Comprando
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

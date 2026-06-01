// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const orderId = pi.metadata?.orderId
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PAID',
            paidAt: new Date(),
            stripePaymentId: pi.id,
            status: 'CONFIRMED',
            timeline: { create: { status: 'CONFIRMED', message: 'Pagamento confirmado via Stripe.' } },
          },
        })
      }
      break
    }
    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      const orderId = pi.metadata?.orderId
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'FAILED' },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

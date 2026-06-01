// src/app/cliente/page.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ClientArea from './ClientArea'

async function getOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, address: true },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function ClientePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/cliente')

  const orders = await getOrders(session.user.id as string)

  return (
    <>
      <Header />
      <main className="nav-offset">
        <ClientArea user={session.user as any} orders={orders as any} />
      </main>
      <Footer />
    </>
  )
}

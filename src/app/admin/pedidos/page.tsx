// src/app/admin/pedidos/page.tsx
import { prisma } from '@/lib/prisma'
import AdminShell from '@/components/admin/AdminShell'
import AdminOrdersClient from './AdminOrdersClient'

async function getOrders() {
  return prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: true,
      address: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

export default async function AdminPedidosPage() {
  const orders = await getOrders()
  return (
    <AdminShell>
      <AdminOrdersClient orders={orders as any} />
    </AdminShell>
  )
}

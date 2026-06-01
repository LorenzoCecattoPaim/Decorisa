// src/app/admin/page.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminDashboard from './AdminDashboard'

async function getMetrics() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [ordersThisMonth, ordersLastMonth, recentOrders, topProducts] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth }, paymentStatus: 'PAID' },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth }, paymentStatus: 'PAID' },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } }, items: true },
    }),
    prisma.orderItem.groupBy({
      by: ['productId', 'name'],
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ])

  const revenueMonth = ordersThisMonth._sum.total ?? 0
  const revenueLastMonth = ordersLastMonth._sum.total ?? 0
  const revDelta = revenueLastMonth > 0 ? ((revenueMonth - revenueLastMonth) / revenueLastMonth) * 100 : 0

  return {
    revenueMonth,
    revenueMonthDelta: revDelta,
    ordersMonth: ordersThisMonth._count,
    ordersMonthDelta: ordersThisMonth._count - ordersLastMonth._count,
    avgTicket: ordersThisMonth._count > 0 ? revenueMonth / ordersThisMonth._count : 0,
    topProducts: topProducts.map((p) => ({
      name: p.name,
      sold: p._sum.quantity ?? 0,
      revenue: p._sum.total ?? 0,
    })),
    recentOrders,
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') redirect('/')

  const metrics = await getMetrics()

  return <AdminDashboard metrics={metrics as any} />
}

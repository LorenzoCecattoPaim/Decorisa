// src/app/admin/cupons/page.tsx
import { prisma } from '@/lib/prisma'
import AdminShell from '@/components/admin/AdminShell'
import AdminCuponsClient from './AdminCuponsClient'

export default async function AdminCuponsPage() {
  const cupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <AdminShell>
      <AdminCuponsClient cupons={cupons as any} />
    </AdminShell>
  )
}

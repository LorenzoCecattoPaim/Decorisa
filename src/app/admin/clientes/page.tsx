// src/app/admin/clientes/page.tsx
import { prisma } from '@/lib/prisma'
import AdminShell from '@/components/admin/AdminShell'
import { formatDate } from '@/utils'

async function getClients() {
  return prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminClientesPage() {
  const clients = await getClients()

  return (
    <AdminShell>
      <div className="px-12 py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-serif text-[2.5rem] font-light text-ink">Clientes</h1>
          <span className="text-[12px] text-cement">{clients.length} clientes cadastrados</span>
        </div>

        <div className="bg-offwhite overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sand">
                {['Nome', 'E-mail', 'Telefone', 'Pedidos', 'Cadastro'].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-[10px] tracking-[0.2em] uppercase text-cement font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-sand hover:bg-sand/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone to-cement flex items-center justify-center text-cream font-serif text-[14px]">
                        {c.name.charAt(0)}
                      </div>
                      <span className="text-[13px] font-light text-ink">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-charcoal font-light">{c.email}</td>
                  <td className="px-5 py-4 text-[13px] text-charcoal font-light">{c.phone ?? '—'}</td>
                  <td className="px-5 py-4 text-[13px] font-light">
                    <span className="text-accent">{c._count.orders}</span>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-cement font-light">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}

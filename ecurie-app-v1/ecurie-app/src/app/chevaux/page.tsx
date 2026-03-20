// src/app/chevaux/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import ChevauxList from '@/components/chevaux/ChevauxList'

export default async function ChevauxPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const role = (session.user as any).role
  const userId = (session.user as any).id

  const where = role === 'PROPRIETAIRE' ? { proprietaireId: userId } : {}

  const chevaux = await prisma.cheval.findMany({
    where,
    include: {
      proprietaire: { select: { nom: true, prenom: true } },
      _count: { select: { activites: true } },
    },
    orderBy: { nom: 'asc' },
  })

  const canCreate = ['GESTIONNAIRE', 'SOIGNEUR'].includes(role)

  return (
    <AppLayout>
      <div className="p-6 lg:p-8">
        <ChevauxList chevaux={JSON.parse(JSON.stringify(chevaux))} canCreate={canCreate} />
      </div>
    </AppLayout>
  )
}

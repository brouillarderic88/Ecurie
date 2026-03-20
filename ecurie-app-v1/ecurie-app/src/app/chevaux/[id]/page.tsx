// src/app/chevaux/[id]/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import ChevalDetail from '@/components/chevaux/ChevalDetail'

export default async function ChevalPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const cheval = await prisma.cheval.findUnique({
    where: { id: params.id },
    include: {
      proprietaire: { select: { id: true, nom: true, prenom: true, email: true, telephone: true } },
      intervenants: {
        include: { intervenant: true },
        where: { actif: true },
        orderBy: { depuis: 'desc' },
      },
      activites: {
        orderBy: { date: 'desc' },
        take: 7,
        include: {
          intervenant: { select: { nom: true, prenom: true, type: true } },
          saisiePar: { select: { nom: true, prenom: true } },
        },
      },
      compteRendus: {
        orderBy: { dateVisite: 'desc' },
        take: 5,
        include: {
          intervenant: { select: { nom: true, prenom: true, type: true } },
          documents: true,
        },
      },
      evenements: {
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' },
        take: 5,
        include: { intervenant: { select: { nom: true, prenom: true } } },
      },
    },
  })

  if (!cheval) notFound()

  const role = (session.user as any).role
  const canEdit = ['GESTIONNAIRE', 'SOIGNEUR'].includes(role)

  return (
    <AppLayout>
      <div className="p-6 lg:p-8">
        <ChevalDetail
          cheval={JSON.parse(JSON.stringify(cheval))}
          canEdit={canEdit}
          role={role}
        />
      </div>
    </AppLayout>
  )
}

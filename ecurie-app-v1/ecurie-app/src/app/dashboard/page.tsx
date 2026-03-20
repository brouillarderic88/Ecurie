// src/app/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { Horse, Calendar, Building2, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [
    totalChevaux,
    activitesAttente,
    reservationsAujourdui,
    messagesNonLus,
    activitesMaquees,
    prochainsEvenements,
  ] = await Promise.all([
    prisma.cheval.count({ where: { statut: 'PRESENT' } }),
    prisma.activite.count({ where: { statut: 'ATTENTE' } }),
    prisma.reservation.count({ where: { date: { gte: today, lt: tomorrow } } }),
    prisma.messageLu.count({ where: { userId: session.user.id } }), // simplifié
    prisma.activite.count({ where: { statut: 'MANQUE', date: { gte: today } } }),
    prisma.evenement.findMany({
      where: { date: { gte: today } },
      orderBy: { date: 'asc' },
      take: 5,
      include: { cheval: true, intervenant: true },
    }),
  ])

  return (
    <AppLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-800">
            Bonjour, {session.user.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-stone-500 mt-1">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Chevaux présents', value: totalChevaux, icon: Horse, color: 'bg-green-50 text-green-700' },
            { label: 'Activités en attente', value: activitesAttente, icon: AlertTriangle, color: activitesAttente > 0 ? 'bg-amber-50 text-amber-700' : 'bg-stone-50 text-stone-500' },
            { label: 'Réservations aujourd\'hui', value: reservationsAujourdui, icon: Building2, color: 'bg-blue-50 text-blue-700' },
            { label: 'Activités manquées', value: activitesMaquees, icon: CheckCircle, color: activitesMaquees > 0 ? 'bg-red-50 text-red-700' : 'bg-stone-50 text-stone-500' },
          ].map(m => {
            const Icon = m.icon
            return (
              <div key={m.label} className="bg-white rounded-xl border border-stone-200 p-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${m.color}`}>
                  <Icon size={16} />
                </div>
                <p className="text-2xl font-semibold text-stone-800">{m.value}</p>
                <p className="text-xs text-stone-500 mt-1">{m.label}</p>
              </div>
            )
          })}
        </div>

        {/* Prochains événements */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-green-700" />
            Prochains événements
          </h2>
          {prochainsEvenements.length === 0 ? (
            <p className="text-stone-400 text-sm">Aucun événement planifié</p>
          ) : (
            <div className="space-y-3">
              {prochainsEvenements.map(evt => (
                <div key={evt.id} className="flex items-center gap-4 py-2 border-b border-stone-50 last:border-0">
                  <div className="text-xs text-stone-400 w-20 flex-shrink-0">
                    {format(evt.date, 'd MMM', { locale: fr })}
                    {evt.heure && <span className="block">{evt.heure}</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">{evt.cheval.nom}</p>
                    <p className="text-xs text-stone-400">
                      {evt.type}{evt.intervenant ? ` · ${evt.intervenant.nom}` : ''}
                    </p>
                  </div>
                  <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
                    {evt.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

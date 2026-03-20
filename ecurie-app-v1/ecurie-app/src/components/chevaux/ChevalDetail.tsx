'use client'
// src/components/chevaux/ChevalDetail.tsx
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Horse, Edit2, Calendar, Stethoscope, Users, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'

const STATUT_STYLES: Record<string, string> = {
  PRESENT: 'bg-green-100 text-green-800',
  ABSENT:  'bg-amber-100 text-amber-800',
  VENDU:   'bg-stone-100 text-stone-600',
  DECEDE:  'bg-red-100 text-red-700',
}

const STATUT_ACT: Record<string, {label: string, color: string}> = {
  PLANIFIE: { label: 'Planifié',   color: 'bg-purple-100 text-purple-800' },
  ATTENTE:  { label: 'En attente', color: 'bg-amber-100 text-amber-800' },
  COMPLETE: { label: 'Complété',   color: 'bg-green-100 text-green-800' },
  MANQUE:   { label: 'Manqué',     color: 'bg-red-100 text-red-800' },
}

const TYPE_INT: Record<string, string> = {
  VETERINAIRE: 'Vétérinaire',
  DENTISTE: 'Dentiste',
  OSTEOPATHE: 'Ostéopathe',
  MARECHAL: 'Maréchal',
  PHYSIOTHERAPEUTE: 'Physio',
  ENTRAINEUR: 'Entraîneur',
  AUTRE: 'Autre',
}

const TABS = [
  { id: 'infos',      label: 'Infos',         icon: Horse },
  { id: 'activites',  label: 'Activités',      icon: Activity },
  { id: 'medical',    label: 'Suivi médical',  icon: Stethoscope },
  { id: 'planning',   label: 'Planning',       icon: Calendar },
  { id: 'intervenants', label: 'Intervenants', icon: Users },
]

export default function ChevalDetail({ cheval, canEdit, role }: { cheval: any, canEdit: boolean, role: string }) {
  const [tab, setTab] = useState('infos')

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/chevaux" className="text-stone-400 hover:text-stone-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 flex items-center gap-3">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <Horse size={22} className="text-green-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-stone-800">{cheval.nom}</h1>
              <span className={clsx('badge', STATUT_STYLES[cheval.statut])}>
                {cheval.statut}
              </span>
            </div>
            <p className="text-sm text-stone-500">
              {[cheval.race, cheval.robe, cheval.sexe].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
        {canEdit && (
          <button className="btn-secondary flex items-center gap-2">
            <Edit2 size={14} />
            Modifier
          </button>
        )}
      </div>

      {/* Onglets */}
      <div className="flex gap-1 border-b border-stone-200 mb-6 overflow-x-auto">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                tab === t.id
                  ? 'border-green-700 text-green-800'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              )}
            >
              <Icon size={14} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Contenu des onglets */}
      {tab === 'infos' && <TabInfos cheval={cheval} />}
      {tab === 'activites' && <TabActivites activites={cheval.activites} chevalId={cheval.id} canEdit={canEdit} />}
      {tab === 'medical' && <TabMedical compteRendus={cheval.compteRendus} />}
      {tab === 'planning' && <TabPlanning evenements={cheval.evenements} />}
      {tab === 'intervenants' && <TabIntervenants intervenants={cheval.intervenants} canEdit={canEdit} />}
    </div>
  )
}

function TabInfos({ cheval }: { cheval: any }) {
  const fields = [
    { label: 'Race', value: cheval.race },
    { label: 'Robe', value: cheval.robe },
    { label: 'Sexe', value: cheval.sexe },
    { label: 'Date de naissance', value: cheval.dateNaissance ? format(new Date(cheval.dateNaissance), 'd MMMM yyyy', { locale: fr }) : null },
    { label: 'Propriétaire', value: `${cheval.proprietaire.prenom} ${cheval.proprietaire.nom}` },
    { label: 'Email propriétaire', value: cheval.proprietaire.email },
    { label: 'Téléphone', value: cheval.proprietaire.telephone },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-5">
        <h3 className="font-medium text-stone-700 mb-4 text-sm">Informations générales</h3>
        <dl className="space-y-3">
          {fields.map(f => f.value && (
            <div key={f.label} className="flex justify-between text-sm">
              <dt className="text-stone-500">{f.label}</dt>
              <dd className="font-medium text-stone-800">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {cheval.notes && (
        <div className="card p-5">
          <h3 className="font-medium text-stone-700 mb-3 text-sm">Notes</h3>
          <p className="text-sm text-stone-600 leading-relaxed">{cheval.notes}</p>
        </div>
      )}
    </div>
  )
}

function TabActivites({ activites, chevalId, canEdit }: { activites: any[], chevalId: string, canEdit: boolean }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-stone-500">{activites.length} dernières activités</p>
        {canEdit && (
          <Link href={`/activites?chevalId=${chevalId}`} className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5">
            <Activity size={13} />
            Voir tout
          </Link>
        )}
      </div>
      <div className="space-y-2">
        {activites.length === 0 && (
          <div className="card p-8 text-center text-stone-400 text-sm">Aucune activité enregistrée</div>
        )}
        {activites.map((a: any) => {
          const s = STATUT_ACT[a.statut]
          return (
            <div key={a.id} className="card p-4 flex items-center gap-4">
              <div className="text-xs text-stone-400 w-20 flex-shrink-0">
                {format(new Date(a.date), 'd MMM', { locale: fr })}
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-stone-700">{a.type}</span>
                {a.note && <p className="text-xs text-stone-400 mt-0.5">{a.note}</p>}
              </div>
              {a.duree && <span className="text-xs text-stone-400">{a.duree} min</span>}
              <span className={clsx('badge', s.color)}>{s.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TabMedical({ compteRendus }: { compteRendus: any[] }) {
  return (
    <div className="space-y-3">
      {compteRendus.length === 0 && (
        <div className="card p-8 text-center text-stone-400 text-sm">Aucun compte rendu médical</div>
      )}
      {compteRendus.map((cr: any) => (
        <div key={cr.id} className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-medium text-stone-800 text-sm">{cr.motif}</p>
              <p className="text-xs text-stone-500 mt-0.5">
                {cr.intervenant.prenom} {cr.intervenant.nom} · {TYPE_INT[cr.intervenant.type]}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400">{format(new Date(cr.dateVisite), 'd MMM yyyy', { locale: fr })}</p>
              {cr.cout && <p className="text-xs font-medium text-stone-600 mt-0.5">CHF {Number(cr.cout)}.-</p>}
            </div>
          </div>
          {cr.diagnostic && <p className="text-xs text-stone-600 bg-stone-50 rounded-lg p-3">{cr.diagnostic}</p>}
          {cr.documents.length > 0 && (
            <div className="mt-2 flex gap-2">
              {cr.documents.map((d: any) => (
                <span key={d.id} className="badge bg-blue-50 text-blue-700">{d.type}</span>
              ))}
            </div>
          )}
          {cr.rdvDescription && (
            <div className="mt-3 p-2.5 border border-amber-200 bg-amber-50 rounded-lg">
              <p className="text-xs text-amber-800">
                Prochain RDV : {cr.rdvDescription}
                {cr.rdvDateCible && ` · ${format(new Date(cr.rdvDateCible), 'd MMM yyyy', { locale: fr })}`}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function TabPlanning({ evenements }: { evenements: any[] }) {
  return (
    <div className="space-y-2">
      {evenements.length === 0 && (
        <div className="card p-8 text-center text-stone-400 text-sm">Aucun événement planifié</div>
      )}
      {evenements.map((evt: any) => (
        <div key={evt.id} className="card p-4 flex items-center gap-4">
          <div className="text-center w-14 flex-shrink-0">
            <p className="text-lg font-semibold text-stone-800 leading-none">
              {format(new Date(evt.date), 'd', { locale: fr })}
            </p>
            <p className="text-xs text-stone-400 uppercase">
              {format(new Date(evt.date), 'MMM', { locale: fr })}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-700">{evt.type}</p>
            {evt.intervenant && (
              <p className="text-xs text-stone-400">{evt.intervenant.prenom} {evt.intervenant.nom}</p>
            )}
          </div>
          {evt.heure && <span className="text-xs text-stone-400">{evt.heure}</span>}
          <span className="badge bg-purple-100 text-purple-800">Planifié</span>
        </div>
      ))}
    </div>
  )
}

function TabIntervenants({ intervenants, canEdit }: { intervenants: any[], canEdit: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {intervenants.length === 0 && (
        <div className="card p-8 text-center text-stone-400 text-sm col-span-2">Aucun intervenant lié</div>
      )}
      {intervenants.map((ci: any) => (
        <div key={ci.intervenantId} className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-xs font-medium text-stone-600">
              {ci.intervenant.prenom?.[0]}{ci.intervenant.nom[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-stone-800">
                {ci.intervenant.prenom} {ci.intervenant.nom}
              </p>
              <span className="badge bg-stone-100 text-stone-600">
                {TYPE_INT[ci.intervenant.type]}
              </span>
            </div>
          </div>
          {(ci.intervenant.telephone || ci.intervenant.email) && (
            <div className="mt-3 pt-3 border-t border-stone-100 space-y-1">
              {ci.intervenant.telephone && (
                <p className="text-xs text-stone-500">{ci.intervenant.telephone}</p>
              )}
              {ci.intervenant.email && (
                <p className="text-xs text-stone-500">{ci.intervenant.email}</p>
              )}
            </div>
          )}
        </div>
      ))}
      {canEdit && (
        <button className="card p-4 border-dashed text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors text-sm flex items-center justify-center gap-2">
          + Ajouter un intervenant
        </button>
      )}
    </div>
  )
}

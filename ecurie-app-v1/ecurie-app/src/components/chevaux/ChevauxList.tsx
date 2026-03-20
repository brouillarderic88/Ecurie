'use client'
// src/components/chevaux/ChevauxList.tsx
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Horse, Calendar } from 'lucide-react'
import clsx from 'clsx'

const STATUT_STYLES: Record<string, string> = {
  PRESENT:  'bg-green-100 text-green-800',
  ABSENT:   'bg-amber-100 text-amber-800',
  VENDU:    'bg-stone-100 text-stone-600',
  DECEDE:   'bg-red-100 text-red-700',
}

const STATUT_LABELS: Record<string, string> = {
  PRESENT: 'Présent',
  ABSENT:  'Absent',
  VENDU:   'Vendu',
  DECEDE:  'Décédé',
}

interface Props {
  chevaux: any[]
  canCreate: boolean
}

export default function ChevauxList({ chevaux, canCreate }: Props) {
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('TOUS')
  const [showForm, setShowForm] = useState(false)

  const filtered = chevaux.filter(c => {
    const matchSearch = c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.race?.toLowerCase().includes(search.toLowerCase())
    const matchStatut = filterStatut === 'TOUS' || c.statut === filterStatut
    return matchSearch && matchStatut
  })

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Chevaux</h1>
          <p className="text-sm text-stone-500 mt-0.5">{chevaux.filter(c => c.statut === 'PRESENT').length} présents sur {chevaux.length}</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Nouveau cheval
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou race…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          {['TOUS', 'PRESENT', 'ABSENT'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatut(s)}
              className={clsx(
                'px-3 py-2 rounded-lg text-xs font-medium transition-colors border',
                filterStatut === s
                  ? 'bg-green-800 text-white border-green-800'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              )}
            >
              {s === 'TOUS' ? 'Tous' : STATUT_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Grille chevaux */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Horse size={32} className="text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500">Aucun cheval trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(cheval => (
            <Link
              key={cheval.id}
              href={`/chevaux/${cheval.id}`}
              className="card p-5 hover:shadow-sm transition-shadow block group"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
                <Horse size={20} className="text-green-700" />
              </div>

              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-stone-800 group-hover:text-green-800 transition-colors">
                  {cheval.nom}
                </h3>
                <span className={clsx('badge ml-2', STATUT_STYLES[cheval.statut])}>
                  {STATUT_LABELS[cheval.statut]}
                </span>
              </div>

              {cheval.race && (
                <p className="text-xs text-stone-500 mb-1">{cheval.race}</p>
              )}
              {cheval.robe && (
                <p className="text-xs text-stone-400">{cheval.robe}</p>
              )}

              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  {cheval.proprietaire.prenom} {cheval.proprietaire.nom}
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Calendar size={11} />
                  {cheval._count.activites} activités
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal création */}
      {showForm && (
        <ChevalForm onClose={() => setShowForm(false)} />
      )}
    </>
  )
}

function ChevalForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nom: '', race: '', robe: '', sexe: '',
    dateNaissance: '', notes: '', proprietaireId: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/chevaux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        window.location.reload()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="font-semibold text-stone-800 mb-5">Nouveau cheval</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">Nom *</label>
              <input className="input" required value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
            </div>
            <div>
              <label className="label">Race</label>
              <input className="input" value={form.race} onChange={e => setForm({...form, race: e.target.value})} />
            </div>
            <div>
              <label className="label">Robe</label>
              <input className="input" value={form.robe} onChange={e => setForm({...form, robe: e.target.value})} />
            </div>
            <div>
              <label className="label">Sexe</label>
              <select className="input" value={form.sexe} onChange={e => setForm({...form, sexe: e.target.value})}>
                <option value="">—</option>
                <option>Hongre</option>
                <option>Jument</option>
                <option>Étalon</option>
              </select>
            </div>
            <div>
              <label className="label">Date de naissance</label>
              <input type="date" className="input" value={form.dateNaissance} onChange={e => setForm({...form, dateNaissance: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="label">ID Propriétaire *</label>
              <input className="input" required placeholder="ID utilisateur propriétaire" value={form.proprietaireId} onChange={e => setForm({...form, proprietaireId: e.target.value})} />
              <p className="text-xs text-stone-400 mt-1">Visible dans Paramètres → Utilisateurs</p>
            </div>
            <div className="col-span-2">
              <label className="label">Notes</label>
              <textarea className="input resize-none" rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Création…' : 'Créer le cheval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

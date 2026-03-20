'use client'
// src/components/layout/AppLayout.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, Horse, Calendar, Stethoscope,
  Building2, MessageSquare, LogOut, Menu, X, ChevronDown
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { href: '/dashboard',      label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/chevaux',        label: 'Chevaux',          icon: Horse },
  { href: '/activites',      label: 'Activités',        icon: Calendar },
  { href: '/medical',        label: 'Suivi médical',    icon: Stethoscope },
  { href: '/reservations',   label: 'Réservations',     icon: Building2 },
  { href: '/communication',  label: 'Communication',    icon: MessageSquare },
]

const ROLE_LABELS: Record<string, string> = {
  GESTIONNAIRE: 'Gestionnaire',
  SOIGNEUR: 'Soigneur',
  PROPRIETAIRE: 'Propriétaire',
  CAVALIER: 'Cavalier',
}

const ROLE_COLORS: Record<string, string> = {
  GESTIONNAIRE: 'bg-green-100 text-green-800',
  SOIGNEUR:     'bg-blue-100 text-blue-800',
  PROPRIETAIRE: 'bg-amber-100 text-amber-800',
  CAVALIER:     'bg-purple-100 text-purple-800',
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const role = (session?.user as any)?.role ?? ''

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200 fixed h-full z-20">
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <p className="font-semibold text-stone-800 text-sm">Écurie Manager</p>
              <p className="text-stone-400 text-xs">Gestion équestre</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  active
                    ? 'bg-green-50 text-green-800 font-medium'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium text-stone-600">
              {session?.user?.name?.[0] ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800 truncate">{session?.user?.name}</p>
              <span className={clsx('text-xs px-1.5 py-0.5 rounded font-medium', ROLE_COLORS[role])}>
                {ROLE_LABELS[role] ?? role}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 w-full px-2 py-1.5 rounded hover:bg-stone-50 transition-colors"
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-stone-200 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">E</span>
          </div>
          <span className="font-semibold text-stone-800 text-sm">Écurie Manager</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-stone-600">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-white pt-16">
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm',
                    active ? 'bg-green-50 text-green-800 font-medium' : 'text-stone-600'
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* Contenu principal */}
      <main className="flex-1 lg:ml-64 pt-0 lg:pt-0">
        <div className="lg:pt-0 pt-14">
          {children}
        </div>
      </main>
    </div>
  )
}

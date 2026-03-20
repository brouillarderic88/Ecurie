// src/types/index.ts
import { Role } from '@prisma/client'

export type { Role }

export interface UserSession {
  id: string
  email: string
  name: string
  role: Role
}

// Permissions par rôle
export const PERMISSIONS = {
  GESTIONNAIRE: {
    chevaux: { read: true, write: true, delete: true },
    activites: { read: true, write: true, delete: true },
    medical: { read: true, write: true, delete: true },
    reservations: { read: true, write: true, delete: true },
    communication: { read: true, write: true, annonce: true },
    infrastructure: { read: true, write: true, delete: true },
    utilisateurs: { read: true, write: true, delete: true },
  },
  SOIGNEUR: {
    chevaux: { read: true, write: true, delete: false },
    activites: { read: true, write: true, delete: false },
    medical: { read: true, write: true, delete: false },
    reservations: { read: true, write: true, delete: false },
    communication: { read: true, write: true, annonce: false },
    infrastructure: { read: true, write: false, delete: false },
    utilisateurs: { read: false, write: false, delete: false },
  },
  PROPRIETAIRE: {
    chevaux: { read: true, write: false, delete: false }, // son cheval seulement
    activites: { read: true, write: false, delete: false },
    medical: { read: true, write: false, delete: false },
    reservations: { read: true, write: true, delete: false }, // ses réservations
    communication: { read: true, write: true, annonce: false },
    infrastructure: { read: true, write: false, delete: false },
    utilisateurs: { read: false, write: false, delete: false },
  },
  CAVALIER: {
    chevaux: { read: false, write: false, delete: false },
    activites: { read: true, write: true, delete: false }, // performances seulement
    medical: { read: false, write: false, delete: false },
    reservations: { read: true, write: true, delete: false },
    communication: { read: true, write: true, annonce: false },
    infrastructure: { read: true, write: false, delete: false },
    utilisateurs: { read: false, write: false, delete: false },
  },
} as const

export function hasPermission(role: Role, module: keyof typeof PERMISSIONS.GESTIONNAIRE, action: string): boolean {
  const perms = PERMISSIONS[role]?.[module] as any
  return perms?.[action] ?? false
}

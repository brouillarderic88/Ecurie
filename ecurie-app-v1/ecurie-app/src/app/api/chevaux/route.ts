// src/app/api/chevaux/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const role = (session.user as any).role
  const userId = (session.user as any).id

  // Propriétaire voit seulement ses chevaux
  const where = role === 'PROPRIETAIRE'
    ? { proprietaireId: userId }
    : role === 'CAVALIER'
    ? {} // cavalier voit tous les chevaux présents
    : {}

  const chevaux = await prisma.cheval.findMany({
    where,
    include: {
      proprietaire: { select: { nom: true, prenom: true } },
      intervenants: {
        include: { intervenant: true },
        where: { actif: true },
      },
      _count: { select: { activites: true, compteRendus: true } },
    },
    orderBy: { nom: 'asc' },
  })

  return NextResponse.json(chevaux)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const role = (session.user as any).role
  if (!['GESTIONNAIRE', 'SOIGNEUR'].includes(role)) {
    return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 })
  }

  const body = await req.json()

  const cheval = await prisma.cheval.create({
    data: {
      nom: body.nom,
      race: body.race || null,
      robe: body.robe || null,
      sexe: body.sexe || null,
      dateNaissance: body.dateNaissance ? new Date(body.dateNaissance) : null,
      statut: body.statut || 'PRESENT',
      notes: body.notes || null,
      proprietaireId: body.proprietaireId,
    },
  })

  // Créer automatiquement le canal de discussion pour ce cheval
  await prisma.canal.create({
    data: {
      type: 'CHEVAL',
      nom: cheval.nom,
      chevalId: cheval.id,
      creeParId: (session.user as any).id,
      membres: {
        create: [
          { userId: (session.user as any).id },
          { userId: body.proprietaireId },
        ],
      },
    },
  })

  return NextResponse.json(cheval, { status: 201 })
}

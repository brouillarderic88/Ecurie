// src/app/api/chevaux/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const cheval = await prisma.cheval.findUnique({
    where: { id: params.id },
    include: {
      proprietaire: { select: { id: true, nom: true, prenom: true, email: true, telephone: true } },
      intervenants: {
        include: { intervenant: true },
        orderBy: { depuis: 'desc' },
      },
      activites: {
        orderBy: { date: 'desc' },
        take: 10,
        include: { intervenant: true, saisiePar: { select: { nom: true, prenom: true } } },
      },
      compteRendus: {
        orderBy: { dateVisite: 'desc' },
        take: 5,
        include: { intervenant: true, documents: true },
      },
      evenements: {
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' },
        take: 5,
        include: { intervenant: true },
      },
    },
  })

  if (!cheval) return NextResponse.json({ error: 'Cheval introuvable' }, { status: 404 })

  return NextResponse.json(cheval)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const role = (session.user as any).role
  if (!['GESTIONNAIRE', 'SOIGNEUR'].includes(role)) {
    return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 })
  }

  const body = await req.json()

  const cheval = await prisma.cheval.update({
    where: { id: params.id },
    data: {
      nom: body.nom,
      race: body.race || null,
      robe: body.robe || null,
      sexe: body.sexe || null,
      dateNaissance: body.dateNaissance ? new Date(body.dateNaissance) : null,
      statut: body.statut,
      notes: body.notes || null,
      proprietaireId: body.proprietaireId,
    },
  })

  return NextResponse.json(cheval)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const role = (session.user as any).role
  if (role !== 'GESTIONNAIRE') {
    return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 })
  }

  // Soft delete : on passe en VENDU/DECEDE plutôt que supprimer
  const cheval = await prisma.cheval.update({
    where: { id: params.id },
    data: { statut: 'VENDU' },
  })

  return NextResponse.json(cheval)
}

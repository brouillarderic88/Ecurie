// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Utilisateurs
  const hash = (pwd) => bcrypt.hashSync(pwd, 10)

  const gestionnaire = await prisma.user.upsert({
    where: { email: 'gestionnaire@ecurie.ch' },
    update: {},
    create: {
      email: 'gestionnaire@ecurie.ch',
      password: hash('ecurie2026'),
      nom: 'Dupont',
      prenom: 'Marie',
      role: 'GESTIONNAIRE',
    },
  })

  const soigneur = await prisma.user.upsert({
    where: { email: 'soigneur@ecurie.ch' },
    update: {},
    create: {
      email: 'soigneur@ecurie.ch',
      password: hash('ecurie2026'),
      nom: 'Durand',
      prenom: 'Marc',
      role: 'SOIGNEUR',
    },
  })

  const proprietaire = await prisma.user.upsert({
    where: { email: 'proprietaire@ecurie.ch' },
    update: {},
    create: {
      email: 'proprietaire@ecurie.ch',
      password: hash('ecurie2026'),
      nom: 'Martin',
      prenom: 'Paul',
      role: 'PROPRIETAIRE',
    },
  })

  const cavalier = await prisma.user.upsert({
    where: { email: 'cavalier@ecurie.ch' },
    update: {},
    create: {
      email: 'cavalier@ecurie.ch',
      password: hash('ecurie2026'),
      nom: 'Müller',
      prenom: 'Sophie',
      role: 'CAVALIER',
    },
  })

  // Intervenants
  const veto = await prisma.intervenant.create({
    data: { nom: 'Martin', prenom: 'Dr Jean', type: 'VETERINAIRE', telephone: '+41 21 000 00 01', email: 'dr.martin@veto.ch' },
  })

  const marechal = await prisma.intervenant.create({
    data: { nom: 'Forge', prenom: 'Paul', type: 'MARECHAL', telephone: '+41 21 000 00 02' },
  })

  // Chevaux
  const tornado = await prisma.cheval.create({
    data: {
      nom: 'Tornado',
      race: 'Selle Français',
      robe: 'Bai',
      sexe: 'Hongre',
      dateNaissance: new Date('2015-04-12'),
      statut: 'PRESENT',
      proprietaireId: proprietaire.id,
    },
  })

  const eclair = await prisma.cheval.create({
    data: {
      nom: 'Éclair',
      race: 'KWPN',
      robe: 'Gris',
      sexe: 'Jument',
      dateNaissance: new Date('2018-07-03'),
      statut: 'PRESENT',
      proprietaireId: gestionnaire.id,
    },
  })

  // Liens cheval-intervenant
  await prisma.chevalIntervenant.create({
    data: { chevalId: tornado.id, intervenantId: veto.id },
  })
  await prisma.chevalIntervenant.create({
    data: { chevalId: tornado.id, intervenantId: marechal.id },
  })

  // Activités
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.activite.createMany({
    data: [
      { chevalId: tornado.id, date: today, type: 'MONTE', statut: 'COMPLETE', duree: 60, intensite: 'MODERE', humeur: 'BIEN', note: 'Bon travail dressage', saisieParId: soigneur.id, valideParId: soigneur.id },
      { chevalId: tornado.id, date: today, type: 'SORTIE', statut: 'COMPLETE', duree: 90, note: 'Paddock matin', saisieParId: soigneur.id, valideParId: soigneur.id },
      { chevalId: eclair.id, date: today, type: 'MONTE', statut: 'ATTENTE', duree: 45, intervenantId: veto.id },
    ],
  })

  // Événements prévisionnels
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  await prisma.evenement.createMany({
    data: [
      { chevalId: tornado.id, type: 'COURS', date: tomorrow, heure: '10:00', intervenantId: null, note: 'Cours dressage' },
      { chevalId: tornado.id, type: 'VETERINAIRE', date: nextWeek, heure: '14:30', intervenantId: veto.id, note: 'Bilan annuel' },
    ],
  })

  // Infrastructures
  await prisma.infrastructure.createMany({
    data: [
      { nom: 'Carrière principale', type: 'CARRIERE', capacite: 3, unite: 'chevaux', prixType: 'HEURE', prix: 15, proprietaireType: 'ECURIE', description: 'Carrière couverte 60x20m', horaires: '07h00 – 21h00', ordre: 1 },
      { nom: 'Rond de longe', type: 'RONDELONGE', capacite: 1, unite: 'cheval', proprietaireType: 'ECURIE', horaires: '07h00 – 20h00', ordre: 2 },
      { nom: 'Marcheur 6 places', type: 'MARCHEUR', capacite: 6, unite: 'places', prixType: 'HEURE', prix: 8, proprietaireType: 'ECURIE', ordre: 3 },
      { nom: 'Van 3 places', type: 'VAN', capacite: 3, unite: 'chevaux', prixType: 'RESERVATION', prix: 80, proprietaireType: 'PROPRIETAIRE', proprietaireId: proprietaire.id, notesInternes: 'Contacter M. Martin pour les clés', ordre: 4 },
      { nom: 'Paddock A', type: 'PADDOCK', capacite: 4, unite: 'chevaux', proprietaireType: 'ECURIE', ordre: 5 },
    ],
  })

  // Canal de discussion pour Tornado
  await prisma.canal.create({
    data: {
      type: 'CHEVAL',
      nom: 'Tornado',
      chevalId: tornado.id,
      creeParId: gestionnaire.id,
      membres: {
        create: [
          { userId: gestionnaire.id },
          { userId: soigneur.id },
          { userId: proprietaire.id },
        ],
      },
    },
  })

  // Canal général
  const canalGeneral = await prisma.canal.create({
    data: {
      type: 'GROUPE',
      nom: 'Tous les membres',
      creeParId: gestionnaire.id,
      membres: {
        create: [
          { userId: gestionnaire.id },
          { userId: soigneur.id },
          { userId: proprietaire.id },
          { userId: cavalier.id },
        ],
      },
    },
  })

  await prisma.message.create({
    data: {
      canalId: canalGeneral.id,
      auteurId: gestionnaire.id,
      texte: 'Bienvenue sur Écurie Manager ! N\'hésitez pas à utiliser ce canal pour toutes les communications générales.',
    },
  })

  console.log('✅ Seed terminé !')
  console.log('\nComptes de test :')
  console.log('  gestionnaire@ecurie.ch / ecurie2026')
  console.log('  soigneur@ecurie.ch     / ecurie2026')
  console.log('  proprietaire@ecurie.ch / ecurie2026')
  console.log('  cavalier@ecurie.ch     / ecurie2026')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

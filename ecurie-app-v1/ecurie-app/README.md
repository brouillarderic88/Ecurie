# Écurie Manager — Application Web

Application de gestion d'écurie de chevaux construite avec Next.js, Prisma et Supabase.

## Stack technique

- **Frontend / Backend** : Next.js 14 (App Router)
- **Base de données** : PostgreSQL via Supabase
- **ORM** : Prisma
- **Authentification** : NextAuth.js
- **Styles** : Tailwind CSS
- **Temps réel** : Socket.io (module communication)

---

## Installation

### 1. Prérequis

- Node.js 18+ installé ([nodejs.org](https://nodejs.org))
- Un compte Supabase gratuit ([supabase.com](https://supabase.com))

### 2. Cloner et installer

```bash
# Installer les dépendances
npm install
```

### 3. Configurer Supabase

1. Créez un nouveau projet sur [supabase.com](https://supabase.com)
2. Dans Settings → Database, copiez l'URL de connexion
3. Dans Settings → API, copiez l'URL et les clés

### 4. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Remplissez `.env.local` avec vos valeurs Supabase :

```
DATABASE_URL="postgresql://postgres:[MOT_DE_PASSE]@db.[REF].supabase.co:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generez-un-secret-aleatoire-ici"
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-anon-key"
SUPABASE_SERVICE_KEY="votre-service-key"
```

> Pour générer NEXTAUTH_SECRET : `openssl rand -base64 32`

### 5. Initialiser la base de données

```bash
# Créer les tables
npm run db:push

# Insérer les données de test
npm run db:seed
```

### 6. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

---

## Comptes de test

| Email | Mot de passe | Rôle |
|---|---|---|
| gestionnaire@ecurie.ch | ecurie2026 | Gestionnaire |
| soigneur@ecurie.ch | ecurie2026 | Soigneur |
| proprietaire@ecurie.ch | ecurie2026 | Propriétaire |
| cavalier@ecurie.ch | ecurie2026 | Cavalier |

---

## Structure du projet

```
src/
├── app/
│   ├── api/           # Routes API (Next.js)
│   │   ├── auth/      # NextAuth
│   │   ├── chevaux/   # CRUD chevaux
│   │   ├── activites/ # Activités
│   │   ├── reservations/
│   │   └── communication/
│   ├── auth/          # Pages auth (login)
│   ├── dashboard/     # Tableau de bord
│   ├── chevaux/       # Module chevaux
│   ├── activites/     # Module activités
│   ├── medical/       # Suivi médical
│   ├── reservations/  # Réservations
│   └── communication/ # Messagerie
├── components/
│   ├── layout/        # AppLayout, navigation
│   ├── ui/            # Composants réutilisables
│   ├── chevaux/       # Composants spécifiques
│   └── ...
├── lib/
│   ├── prisma.ts      # Client Prisma singleton
│   └── auth.ts        # Configuration NextAuth
├── types/
│   └── index.ts       # Types TypeScript + permissions
prisma/
├── schema.prisma      # Schéma base de données
└── seed.js            # Données de test
```

---

## Modules disponibles (v1)

- **Étape 1** ✅ Structure + Authentification (4 rôles)
- **Étape 2** 🔜 Module Chevaux
- **Étape 3** 🔜 Module Activités + Planning
- **Étape 4** 🔜 Module Suivi médical
- **Étape 5** 🔜 Module Réservations
- **Étape 6** 🔜 Module Communication

---

## Déploiement sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Ajouter les variables d'environnement dans le dashboard Vercel
# puis redéployer
vercel --prod
```

---

## Développement

```bash
npm run dev          # Serveur de développement
npm run db:studio    # Interface visuelle Prisma
npm run build        # Build production
npm run lint         # Linter
```

# Module — Communication

Dernière mise à jour : 20 mars 2026

## Objectif
Centraliser toutes les communications de l'écurie dans l'application : messagerie privée, groupes de discussion, fil par cheval, et annonces officielles.

---

## Les 4 canaux de communication

| Canal | Description | Qui crée |
|---|---|---|
| Messagerie privée (1 à 1) | Conversation directe entre deux utilisateurs | N'importe quel membre |
| Groupe de discussion | Conversation multi-membres | Gestionnaire, soigneur, ou n'importe quel membre |
| Fil par cheval | Discussion liée à un cheval spécifique | Automatique à la création du cheval |
| Annonces | Message officiel visible par tous | Gestionnaire uniquement |

---

## Messagerie privée

- Tout utilisateur peut initier une conversation avec n'importe quel autre membre
- Contenu : texte uniquement
- Réponse à un message spécifique (citation)
- Badge de messages non lus sur le canal

---

## Groupes de discussion

### Qui peut créer un groupe ?
- Gestionnaire : tous types de groupes
- Soigneur : groupes internes (soigneurs, équipe)
- N'importe quel membre : groupes libres

### Groupes automatiques créés par le système
- Un groupe est automatiquement créé pour chaque cheval, incluant : gestionnaire, soigneurs, propriétaire(s) du cheval, cavaliers liés
- Permet de centraliser les échanges autour d'un cheval sans créer manuellement le groupe

### Contenu
- Texte + réponse à un message (citation)

---

## Annonces

- Publiées par le gestionnaire uniquement
- Visibles par tous les membres de l'écurie
- Peuvent être marquées "Important" (badge orange)
- Affichées en ordre chronologique inverse
- Notification push + email à tous les membres à la publication

---

## Fil de discussion par cheval

- Créé automatiquement pour chaque cheval
- Membres : gestionnaire + soigneurs + propriétaire(s) + cavaliers liés au cheval
- Utile pour les échanges rapides sur l'état du cheval (ex. "boiterie observée ce matin")
- Visible depuis la fiche du cheval ET depuis le module communication

---

## Droits d'accès

| Action | Gestionnaire | Soigneur | Propriétaire | Cavalier |
|---|---|---|---|---|
| Messagerie privée | Oui | Oui | Oui | Oui |
| Créer un groupe | Oui | Oui | Oui | Oui |
| Publier une annonce | Oui | Non | Non | Non |
| Accès fil cheval | Oui | Oui | Son cheval | Son cheval |
| Supprimer un message | Auteur ou gestionnaire | Auteur | Auteur | Auteur |
| Gérer les membres d'un groupe | Créateur ou gestionnaire | — | — | — |

---

## Contenu des messages

| Type | Supporté |
|---|---|
| Texte | Oui |
| Réponse / citation | Oui |
| Photos / images | Non (v1) |
| Documents PDF | Non (v1) |

> Les photos et documents peuvent être partagés via le module suivi médical ou activités. La messagerie reste volontairement simple en v1.

---

## Notifications

| Déclencheur | Destinataire | Canal |
|---|---|---|
| Nouveau message privé reçu | Destinataire | Push mobile + email |
| Nouveau message dans un groupe | Membres du groupe | Push mobile + email |
| Nouveau message dans fil cheval | Membres du fil | Push mobile + email |
| Nouvelle annonce publiée | Tous les membres | Push mobile + email |

### Préférences utilisateur
Chaque utilisateur peut configurer ses préférences de notification :
- Activer / désactiver push mobile
- Activer / désactiver email
- Par canal (tout, groupes seulement, mentions seulement)

---

## Modèle de données

### Table `canal`
| Champ | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| type | Enum | prive, groupe, cheval, annonce |
| nom | String | Nom du canal (nullable pour privé) |
| cheval_id | UUID | Lien cheval si type=cheval (nullable) |
| cree_par | UUID | Utilisateur créateur |
| created_at | Timestamp | Date de création |

### Table `canal_membre`
| Champ | Type | Description |
|---|---|---|
| canal_id | UUID | Clé étrangère |
| user_id | UUID | Clé étrangère |
| rejoint_le | Timestamp | Date d'ajout |
| notifications | Boolean | Notifications activées |

### Table `message`
| Champ | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| canal_id | UUID | Clé étrangère |
| auteur_id | UUID | Clé étrangère |
| texte | Text | Contenu du message |
| reply_to_id | UUID | Message cité (nullable) |
| created_at | Timestamp | Date d'envoi |
| modifie_le | Timestamp | Date de modification (nullable) |
| supprime | Boolean | Message supprimé (soft delete) |

### Table `message_lu`
| Champ | Type | Description |
|---|---|---|
| message_id | UUID | Clé étrangère |
| user_id | UUID | Clé étrangère |
| lu_le | Timestamp | Date de lecture |

---

## Questions ouvertes
- [ ] Faut-il des mentions @utilisateur dans les messages ?
- [ ] Historique des messages : conservation illimitée ou sur une période ?
- [ ] Faut-il une recherche dans les messages ?
- [ ] Photos et documents en v2 ?

---

## Liens
- [Retour aux modules](README.md)
- [Module chevaux](module-chevaux.md)
- [Module notifications](module-notifications.md)

---

## Choix technologique — Messagerie intégrée

Dernière mise à jour : 20 mars 2026

### Décision
La messagerie est construite **directement dans l'application** (messagerie intégrée). Aucun service tiers payant n'est utilisé pour les messages.

### Alternatives évaluées et écartées

| Option | Raison du rejet |
|---|---|
| WhatsApp Business API | Coût par message ($0.03–0.05 / message envoyé par l'appli) |
| Matrix / Element | Complexité d'administration serveur Synapse injustifiée pour l'usage |

### Stack technique retenue

| Composant | Technologie | Coût |
|---|---|---|
| Stockage des messages | Base de données PostgreSQL | Inclus |
| Temps réel (messages instantanés) | WebSockets (ex. Socket.io) | Gratuit |
| Notifications push mobile | Firebase Cloud Messaging (FCM) | Gratuit |
| Notifications email | À définir (ex. SendGrid free tier) | Gratuit (jusqu'à 100/jour) |

### Avantages
- Zéro coût par message, quelle que soit l'utilisation
- Données 100% hébergées sur votre serveur
- Aucune dépendance à un service tiers pour la messagerie
- Contrôle total sur les fonctionnalités et l'historique

### ADR associé
Voir [ADR-003 — Messagerie intégrée sans service tiers](../decisions/adr-003-messagerie-integree.md)

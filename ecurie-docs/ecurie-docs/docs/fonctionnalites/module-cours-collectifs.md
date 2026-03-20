# Module — Cours collectifs

Dernière mise à jour : 20 mars 2026

## Objectif
Permettre au gestionnaire d'organiser des cours collectifs pour plusieurs cavaliers (avec leur cheval), de gérer les inscriptions, le suivi des présences et les séries récurrentes.

---

## Types de cours

| Type | Description |
|---|---|
| Dressage | Travail monté — figures et mouvements |
| Saut d'obstacles | CSO — barres et parcours |
| Galop / endurance | Travail en extérieur ou en piste |
| Longe / travail à pied | Travail sans cavalier |
| Théorie équestre | Cours en salle (soins, anatomie…) |
| Autre | Type libre saisi par le gestionnaire |

---

## Informations d'un cours

| Champ | Obligatoire | Description |
|---|---|---|
| Titre | Oui | Nom du cours |
| Type | Oui | Parmi la liste ci-dessus |
| Niveau | Oui | DEBUTANT, INTERMEDIAIRE, AVANCE |
| Date | Oui | Date de la séance |
| Heure début | Oui | Heure de début |
| Durée | Oui | En minutes |
| Professeur | Oui | Lien vers fiche intervenant |
| Infrastructure | Oui | Lien vers infrastructure (carrière, salle…) |
| Nombre de places max | Oui | Limite d'inscription |
| Notes | Non | Informations complémentaires |
| Série | Non | Lien vers série récurrente si applicable |

---

## Inscriptions

- Gérées par le **gestionnaire uniquement**
- Chaque inscription lie un **cavalier + son cheval** (les deux ensemble)
- Exception : cours de théorie — cheval optionnel
- Impossible de s'inscrire si le cours est complet (places max atteintes)
- Impossible de s'inscrire si le cours est annulé ou terminé

---

## Présences

Le gestionnaire ou soigneur marque la présence de chaque inscrit :
- **Présent** ✓ — participant venu au cours
- **Absent** ✕ — inscrit non venu
- **À venir** — cours pas encore passé

---

## Statuts d'un cours

| Statut | Description |
|---|---|
| Planifié | Cours à venir — inscriptions ouvertes |
| En cours | Cours en train de se dérouler |
| Terminé | Cours passé — présences tracées |
| Annulé | Cours supprimé — notifications envoyées |

---

## Séries récurrentes

- Un cours peut appartenir à une série (ex. dressage tous les mardis)
- Création en une fois pour toute une période
- Modification possible sur toute la série ou occurrence par occurrence
- Suspension temporaire possible sans supprimer la série

---

## Vues disponibles

### Liste des cours
- Tous les cours avec filtres par type, niveau, statut
- Barre de progression des places
- Avatars des inscrits visibles directement
- Clic → détail complet + liste participants + actions

### Calendrier hebdomadaire
- Vue 7 jours avec tous les cours positionnés
- Code couleur par type de cours

### Séries récurrentes
- Vue dédiée à la gestion des séries
- Modification / suspension en lot

---

## Droits d'accès

| Action | Gestionnaire | Soigneur | Propriétaire | Cavalier |
|---|---|---|---|---|
| Créer / modifier un cours | Oui | Non | Non | Non |
| Annuler un cours | Oui | Non | Non | Non |
| Inscrire un participant | Oui | Non | Non | Non |
| Désinscrire un participant | Oui | Non | Non | Non |
| Marquer les présences | Oui | Oui | Non | Non |
| Consulter la liste des inscrits | Oui | Oui | Oui | Oui |
| Gérer les séries récurrentes | Oui | Non | Non | Non |

---

## Notifications

| Déclencheur | Destinataire | Canal | Délai |
|---|---|---|---|
| Inscription créée | Cavalier inscrit | Push + email | Immédiat |
| Cours annulé | Tous les inscrits | Push + email | Immédiat |
| Rappel cours à venir | Tous les inscrits | Push + email | J-1 à 18h00 |
| Place disponible (si liste d'attente — v2) | — | — | — |

---

## Lien avec les autres modules

- **Infrastructures** : réservation automatique de l'infrastructure lors de la création du cours (vérifie disponibilité et capacité)
- **Activités** : une séance terminée génère automatiquement une activité de type COURS dans le journal de chaque cheval inscrit
- **Intervenants** : le professeur est lié à la table Intervenant

---

## Modèle de données

### Table `cours_collectif`
| Champ | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| titre | String | Nom du cours |
| type | Enum | DRESSAGE, SAUT, GALOP, LONGE, THEORIE, AUTRE |
| niveau | Enum | DEBUTANT, INTERMEDIAIRE, AVANCE |
| date | Date | Date de la séance |
| heureDebut | Time | Heure de début |
| duree | Integer | Durée en minutes |
| maxPlaces | Integer | Nombre de places maximum |
| statut | Enum | PLANIFIE, EN_COURS, TERMINE, ANNULE |
| notes | Text | Notes libres (nullable) |
| intervenantId | UUID | Réf. Intervenant (professeur) |
| infrastructureId | UUID | Réf. Infrastructure |
| serieId | UUID | Réf. SerieCoursCollectif (nullable) |
| createdAt | Timestamp | Date de création |
| updatedAt | Timestamp | Date de mise à jour |

### Table `inscription_cours`
| Champ | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| presence | Enum | A_VENIR, PRESENT, ABSENT |
| note | Text | Note sur la présence (nullable) |
| coursId | UUID | Réf. CoursCollectif |
| cavalier_id | UUID | Réf. User (cavalier) |
| chevalId | UUID | Réf. Cheval (nullable — optionnel pour théorie) |
| inscritParId | UUID | Réf. User (gestionnaire qui a inscrit) |
| createdAt | Timestamp | Date d'inscription |

### Table `serie_cours_collectif`
| Champ | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| titre | String | Nom de la série |
| type | Enum | Type de cours |
| niveau | Enum | Niveau de la série |
| jourSemaine | Integer | 0=lundi … 6=dimanche |
| heureDebut | Time | Heure de début |
| duree | Integer | Durée en minutes |
| maxPlaces | Integer | Places maximum |
| dateDebut | Date | Début de la série |
| dateFin | Date | Fin de la série (nullable) |
| actif | Boolean | Série active (défaut : true) |
| intervenantId | UUID | Réf. Intervenant |
| infrastructureId | UUID | Réf. Infrastructure |
| createdAt | Timestamp | Date de création |

---

## Questions ouvertes
- [ ] Faut-il une liste d'attente quand le cours est complet ?
- [ ] Un cavalier peut-il être inscrit avec deux chevaux différents au même cours ?
- [ ] Faut-il un export PDF de la feuille de présence ?
- [ ] Intégration future avec la facturation (prix par cours) ?

---

## Liens
- [Retour aux modules](README.md)
- [Module activités](module-activites.md)
- [Module réservations](module-reservations.md)
- [Module intervenants](module-chevaux.md)
- [Module notifications](module-notifications.md)

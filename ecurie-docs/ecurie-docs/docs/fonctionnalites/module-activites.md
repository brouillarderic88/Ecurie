# Module — Suivi d'activité du cheval

Dernière mise à jour : 20 mars 2026

## Objectif
Tracer toutes les activités quotidiennes de chaque cheval, combiner le prévisionnel (planning) et le réalisé (journal), et visualiser l'historique dans le temps.

---

## Deux dimensions complémentaires

| Dimension | Description |
|---|---|
| Prévisionnel | Événements planifiés à l'avance (cours, concours, soins…) |
| Réalisé | Ce qui a été effectivement fait chaque jour, validé par le soigneur |

> Un événement planifié bascule automatiquement en activité réalisée à confirmer à minuit.

---

## Types d'activités

### Activités réalisées (journal quotidien)
| Type | Description |
|---|---|
| Travail monté | Dressage, saut, galop, promenade… |
| Travail à pied | Longe, liberté, travail en main… |
| Sortie / paddock | Pâturage, paddock, détente extérieure |
| Repos / convalescence | Jour sans activité, récupération |

### Événements prévisionnels (calendrier)
| Type | Description | Récurrence possible |
|---|---|---|
| Cours avec professeur | Ponctuel ou récurrent (ex. tous les mardis) | Oui |
| Concours / compétition | Date, lieu, discipline | Non |
| Visite vétérinaire | Planifiée à l'avance | Non |
| Soin planifié | Ferrure, ostéo, dentiste… | Non |
| Entraînement | Séance programmée | Oui |

---

## Informations saisies par activité

| Champ | Obligatoire | Commentaire |
|---|---|---|
| Date | Oui | Auto-remplie |
| Type | Oui | Parmi la liste ci-dessus |
| Durée | Non | En minutes |
| Intensité | Non | Léger / Modéré / Intense |
| Intervenant | Non | Lien vers fiche intervenant |
| Humeur du cheval | Non | Bien / Moyen / Fatigué |
| Note libre | Non | Observation textuelle |

---

## Workflow de validation (4 statuts)

```
[Planifié] ──minuit──▶ [En attente] ──soigneur valide──▶ [Complété]
                              │
                    fin de journée sans action
                              │
                              ▼
                          [Manqué] ──▶ alerte gestionnaire
```

### Code couleur

| Statut | Couleur | Préfixe | Signification |
|---|---|---|---|
| Planifié | Violet | — | Événement futur programmé |
| En attente | Orange | ! | Passé, à confirmer par soigneur |
| Complété | Vert | ✓ | Validé et renseigné par soigneur |
| Manqué | Rouge | ✕ | Non réalisé, alerte envoyée |

---

## Cours récurrents

- Création en une seule fois pour toute une période (ex. tous les mardis 10h avec Sophie M.)
- Ou saisie ponctuelle séance par séance
- Modification / suppression possible sur toute la série ou occurrence par occurrence

---

## Notifications et rappels

| Déclencheur | Destinataire | Délai |
|---|---|---|
| Événement planifié à venir | Soigneur + intervenant | J-1 à 18h00 |
| Activité "en attente" non validée | Gestionnaire | Fin de journée (20h00) |
| Activité passée en "manqué" | Gestionnaire | Immédiat |

---

## Vue calendrier mensuelle

- Vue par défaut : mois complet
- Navigation mois par mois
- Code couleur des statuts visible directement dans le calendrier
- Clic sur un événement → détail + action (valider, signaler motif)
- Symbole ↻ sur les événements récurrents

## Vue tableau hebdomadaire

- Vue 7 jours avec toutes les activités
- Statistiques de la semaine (complétés, en attente, manqués, planifiés)
- Navigation semaine par semaine
- Clic sur une activité → détail complet

---

## Modèle de données

### Table `activite`
| Champ | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| cheval_id | UUID | Clé étrangère |
| date | Date | Jour de l'activité |
| type | Enum | monte, pied, sortie, repos, cours, veto, soin, entrainement |
| statut | Enum | planifie, attente, complete, manque |
| duree | Integer | En minutes (nullable) |
| intensite | Enum | leger, modere, intense (nullable) |
| intervenant_id | UUID | Clé étrangère (nullable) |
| humeur | Enum | bien, moyen, fatigue (nullable) |
| note | Text | Observation libre (nullable) |
| valide_par | UUID | Soigneur ayant complété (nullable) |
| valide_le | Timestamp | Date/heure de validation (nullable) |
| source_evenement_id | UUID | Lien vers l'événement prévisionnel d'origine (nullable) |

### Table `evenement`
| Champ | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| cheval_id | UUID | Clé étrangère |
| type | Enum | cours, concours, veto, soin, entrainement |
| date | Date | Date prévue |
| heure | Time | Heure prévue |
| intervenant_id | UUID | Clé étrangère (nullable) |
| note | Text | Informations complémentaires |
| serie_id | UUID | Lien vers série récurrente (nullable) |
| rappel_envoye | Boolean | Si la notif J-1 a été envoyée |

### Table `serie_recurrente`
| Champ | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| cheval_id | UUID | Clé étrangère |
| type | Enum | Type d'événement |
| jour_semaine | Integer | 0=lundi … 6=dimanche |
| heure | Time | Heure de début |
| intervenant_id | UUID | Clé étrangère (nullable) |
| date_debut | Date | Début de la série |
| date_fin | Date | Fin de la série (nullable) |
| actif | Boolean | Série active ou suspendue |

---

## Jobs automatiques (backend)

| Job | Heure | Action |
|---|---|---|
| Bascule planifié → en attente | 00h00 | Tous les événements passés passent en `attente` |
| Bascule en attente → manqué | 20h00 | Les `attente` non validés passent en `manque` |
| Envoi rappel J-1 | 18h00 | Notification soigneur + intervenant |
| Alerte manqué | Immédiat | Notification gestionnaire |

---

## Questions ouvertes
- [ ] Un cheval peut-il avoir plusieurs activités le même jour ? (probable : oui)
- [ ] Les jours sans saisie sont-ils "non renseigné" ou "repos par défaut" ?
- [ ] Le propriétaire peut-il consulter le journal d'activité de son cheval ?
- [ ] Faut-il un export du journal d'activité (PDF, Excel) ?

---

## Liens
- [Retour aux modules](README.md)
- [Module chevaux](module-chevaux.md)
- [Module notifications](module-notifications.md)
- [Module planning](module-planning.md)

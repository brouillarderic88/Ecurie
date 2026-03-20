# Module — Réservation des infrastructures

Dernière mise à jour : 20 mars 2026

## Objectif
Permettre à tous les utilisateurs de réserver les infrastructures de l'écurie (carrière, paddocks, marcheur…) en temps réel, avec détection automatique des conflits de capacité.

---

## Infrastructures gérées

La liste est configurable par le gestionnaire. Exemples par défaut :

| Infrastructure | Capacité par défaut | Usage exclusif |
|---|---|---|
| Carrière / piste | N chevaux simultanés | Non |
| Rond de longe | 1 cheval | Oui |
| Marcheur | N places | Non |
| Paddock | N chevaux | Non |
| Salle de travail | 1 utilisateur | Oui |
| Box temporaire | 1 cheval | Oui |
| Remorque / van | N chevaux | Non |

> Le gestionnaire peut créer, modifier, désactiver n'importe quelle infrastructure depuis les paramètres.
> Chaque infrastructure a un nom libre, un type, et une capacité maximale.

---

## Fonctionnement des réservations

- Créneau libre : l'utilisateur choisit une heure de début et une heure de fin
- Système premier arrivé, premier servi — pas de validation gestionnaire requise
- Une réservation est confirmée instantanément si la capacité le permet
- Si la capacité est atteinte sur le créneau demandé → refus automatique + message d'erreur

---

## Droits d'accès

| Action | Gestionnaire | Soigneur | Propriétaire | Cavalier |
|---|---|---|---|---|
| Voir le planning | Oui | Oui | Oui | Oui |
| Créer une réservation | Oui | Oui | Oui | Oui |
| Modifier sa réservation | Oui | Oui | Oui | Oui |
| Annuler sa réservation | Oui | Oui | Oui | Oui |
| Annuler la réservation d'autrui | Oui | Non | Non | Non |
| Gérer les infrastructures | Oui | Non | Non | Non |

---

## Contenu d'une réservation

| Champ | Obligatoire | Description |
|---|---|---|
| Infrastructure | Oui | Sélection dans la liste |
| Date | Oui | Jour de la réservation |
| Heure début | Oui | Créneau de début |
| Heure fin | Oui | Créneau de fin |
| Cheval | Non | Cheval concerné (nullable) |
| Note | Non | Motif ou commentaire libre |
| Réservé par | Auto | Utilisateur connecté |

---

## Détection des conflits

| Situation | Comportement |
|---|---|
| Infrastructure avec réservation "non partageable" | Refus immédiat quelle que soit la capacité |
| Infrastructure à capacité N — limite atteinte | Refus immédiat + message |
| Infrastructure à capacité N — place disponible | Confirmation immédiate |
| Même cheval déjà réservé ailleurs au même créneau | Alerte (pas de blocage) |

---

## Notifications

| Déclencheur | Destinataire | Canal |
|---|---|---|
| Conflit de capacité détecté | Utilisateur qui réserve | Push + message in-app |
| Réservation annulée par le gestionnaire | Utilisateur concerné | Push + email |

> Pas de rappel avant le créneau (non demandé).
> Pas de notification au gestionnaire à chaque réservation (non demandé).

---

## Vues disponibles

### Vue journalière (défaut)
- Timeline heure par heure (7h → 21h)
- Toutes les infrastructures visibles en cards
- Clic sur une infrastructure → timeline détaillée
- Clic sur un créneau → détail de la réservation

### Vue hebdomadaire (à prévoir)
- Vue 7 jours par infrastructure
- Utile pour planifier sur la semaine

---

## Modèle de données

### Table `infrastructure`
| Champ | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| nom | String | Nom affiché |
| type | Enum | carriere, rondelonge, marcheur, paddock, salle, box, van, autre |
| capacite | Integer | Nombre max d'occupants simultanés |
| unite | String | Label de la capacité (chevaux, places…) |
| actif | Boolean | Visible et réservable |
| ordre | Integer | Ordre d'affichage |

### Table `reservation`
| Champ | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| infrastructure_id | UUID | Clé étrangère |
| date | Date | Jour de la réservation |
| heure_debut | Time | Début du créneau |
| heure_fin | Time | Fin du créneau |
| cheval_id | UUID | Clé étrangère (nullable) |
| note | Text | Commentaire libre (nullable) |
| reserve_par | UUID | Utilisateur auteur |
| created_at | Timestamp | Date de création |

---

## Règle de gestion — vérification des conflits (backend)

Avant d'insérer une réservation, le backend vérifie :
```
SELECT COUNT(*) FROM reservation
WHERE infrastructure_id = ?
  AND date = ?
  AND heure_debut < [nouvelle heure_fin]
  AND heure_fin > [nouvelle heure_debut]
```
Si `COUNT(*) >= infrastructure.capacite` → refus.

---

## Questions ouvertes
- [ ] Faut-il une vue hebdomadaire en plus de la vue journalière ?
- [ ] Certaines infrastructures sont-elles payantes (facturation à l'heure) ?
- [ ] Faut-il des plages horaires d'ouverture / fermeture par infrastructure ?
- [ ] Possibilité de bloquer une infrastructure pour maintenance ?

---

## Liens
- [Retour aux modules](README.md)
- [Module activités](module-activites.md)
- [Module planning](module-planning.md)
- [Module facturation](module-facturation.md)

---

## Règle de partage (mise à jour)

Le champ `partage` sur la réservation prime sur la capacité de l'infrastructure :

| Situation | Comportement |
|---|---|
| Créneau libre | Réservation confirmée, choix partage oui/non |
| Réservation existante `partage = non` | Refus immédiat, quel que soit le nombre de places |
| Réservation existante `partage = oui` + capacité disponible | Nouvelle réservation acceptée |
| Nouvelle réservation `partage = non` + créneau déjà occupé | Refus immédiat |

### Règle backend mise à jour

```
-- Vérifier si une réservation "non partageable" existe déjà
SELECT COUNT(*) FROM reservation
WHERE infrastructure_id = ?
  AND date = ?
  AND heure_debut < [nouvelle heure_fin]
  AND heure_fin > [nouvelle heure_debut]
  AND partage = false
→ Si COUNT(*) > 0 : refus

-- Vérifier la capacité globale
SELECT COUNT(*) FROM reservation
WHERE infrastructure_id = ?
  AND date = ?
  AND heure_debut < [nouvelle heure_fin]
  AND heure_fin > [nouvelle heure_debut]
→ Si COUNT(*) >= infrastructure.capacite : refus

-- Si la nouvelle réservation est "non partageable"
-- vérifier qu'aucune autre réservation n'existe
SELECT COUNT(*) FROM reservation
WHERE infrastructure_id = ?
  AND date = ?
  AND heure_debut < [nouvelle heure_fin]
  AND heure_fin > [nouvelle heure_debut]
→ Si COUNT(*) > 0 ET nouvelle.partage = false : refus
```

# Module — Suivi médical du cheval

Dernière mise à jour : 20 mars 2026

## Objectif
Centraliser l'historique médical complet de chaque cheval : visites, comptes rendus d'intervention, ordonnances et suivi des traitements, avec planification automatique des prochains rendez-vous.

---

## Intervenants concernés

| Type | Compte rendu médical |
|---|---|
| Vétérinaire | Oui |
| Dentiste équin | Oui |
| Ostéopathe | Oui |
| Maréchal ferrant | Oui |
| Physiothérapeute | Oui |
| Autre (libre) | Oui |

> Tous ces intervenants sont liés à la fiche cheval via la table `cheval_intervenant` (voir module Chevaux).

---

## Contenu d'un compte rendu d'intervention

| Champ | Obligatoire | Description |
|---|---|---|
| Date de visite | Oui | Date de l'intervention |
| Intervenant | Oui | Lien vers fiche intervenant |
| Motif | Oui | Raison de la visite |
| Diagnostic / observations | Non | Constat de l'intervenant |
| Traitement prescrit | Non | Description textuelle |
| Ordonnance | Non | Document PDF / image joint |
| Coût | Non | Montant de l'intervention (CHF) |
| Prochain RDV | Non | Description + date cible |
| Saisi par | Auto | Utilisateur ayant créé le CR |

> Le détail des médicaments n'est pas structuré — le document ordonnance joint suffit.
> Pas de suivi de stock médicaments prévu.

---

## Droits d'accès

| Action | Gestionnaire | Soigneur | Propriétaire | Cavalier |
|---|---|---|---|---|
| Créer un CR | Oui | Oui | Non | Non |
| Modifier un CR | Oui | Auteur seulement | Non | Non |
| Consulter CR + ordonnance | Oui | Oui | Oui (son cheval) | Non |
| Supprimer un CR | Oui | Non | Non | Non |
| Planifier RDV depuis CR | Oui | Oui | Non | Non |

---

## Lien avec le calendrier prévisionnel

Depuis un compte rendu, si un "prochain RDV" est renseigné :
- Bouton "Planifier" crée directement un événement dans le module Activités
- L'événement est pré-rempli avec l'intervenant, la date cible et le motif
- Il apparaît dans le calendrier mensuel avec le statut "Planifié"

---

## Tableau de bord médical (par cheval)

Indicateurs visibles en haut de la fiche médicale :
- Nombre total d'interventions
- Nombre de CR avec ordonnance
- Nombre de RDV à planifier (alerte orange)
- Coût total des interventions sur la période

---

## Alertes

| Déclencheur | Destinataire | Canal |
|---|---|---|
| RDV recommandé non planifié sous 7 jours | Gestionnaire | Push + email |
| Nouveau CR créé | Propriétaire (son cheval) | Push + email |

---

## Modèle de données

### Table `compte_rendu`
| Champ | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| cheval_id | UUID | Clé étrangère |
| intervenant_id | UUID | Clé étrangère |
| date_visite | Date | Date de l'intervention |
| motif | Text | Raison de la visite |
| diagnostic | Text | Observations (nullable) |
| traitement | Text | Description traitement (nullable) |
| cout | Decimal | Montant CHF (nullable) |
| rdv_description | Text | Prochain RDV texte (nullable) |
| rdv_date_cible | Date | Date cible prochain RDV (nullable) |
| rdv_planifie | Boolean | Si le RDV a été créé dans le calendrier |
| evenement_id | UUID | Lien vers l'événement planifié (nullable) |
| saisi_par | UUID | Utilisateur auteur |
| created_at | Timestamp | Date de création |

### Table `document_medical`
| Champ | Type | Description |
|---|---|---|
| id | UUID | Clé primaire |
| compte_rendu_id | UUID | Clé étrangère |
| type | Enum | ordonnance, radio, photo, autre |
| nom_fichier | String | Nom d'affichage |
| url_stockage | String | URL fichier (S3 / Cloudinary) |
| uploaded_at | Timestamp | Date d'upload |

---

## Questions ouvertes
- [ ] Faut-il un export PDF de la fiche médicale complète (historique sur une période) ?
- [ ] Le propriétaire reçoit-il une notification pour chaque nouveau CR ou seulement pour les CR vétérinaires ?
- [ ] Faut-il une signature électronique de l'intervenant sur le CR ?
- [ ] Limite de taille des fichiers joints (ordonnances, radios) ?

---

## Liens
- [Retour aux modules](README.md)
- [Module chevaux](module-chevaux.md)
- [Module activités](module-activites.md)
- [Module notifications](module-notifications.md)

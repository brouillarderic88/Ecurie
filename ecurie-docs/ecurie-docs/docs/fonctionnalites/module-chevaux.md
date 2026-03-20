# Module — Chevaux

## Objectif
Centraliser toutes les informations relatives aux chevaux hébergés dans l'écurie.

## Fonctionnalités

### Fiche cheval[module-chevaux.md](https://github.com/user-attachments/files/26137061/module-chevaux.md)# Module — Chevaux

Dernière mise à jour : 20 mars 2026

## Objectif
Centraliser toutes les informations relatives aux chevaux hébergés dans l'écurie, accessibles selon les rôles de chaque utilisateur.

---

## Fonctionnalités

### Fiche cheval
- [ ] Nom, race, robe, sexe, date de naissance
- [ ] Photo du cheval
- [ ] Statut (présent, absent, vendu, décédé)
- [ ] Propriétaire associé (lien vers fiche contact)
- [ ] Box / paddock assigné

### Intervenants liés (tous optionnels)

| Intervenant | Historique d'interventions | Notes |
|---|---|---|
| Vétérinaire | Oui — date, motif, compte-rendu, coût | Peut suivre plusieurs chevaux |
| Dentiste équin | Oui — date, soin réalisé, coût | Peut suivre plusieurs chevaux |
| Ostéopathe | Oui — date, soin réalisé, coût | Peut suivre plusieurs chevaux |
| Maréchal ferrant | Oui — date, type de ferrure, coût | Peut suivre plusieurs chevaux |
| Entraîneur | Non — contact uniquement | Interventions tracées dans module Performances |

> Un même intervenant peut être lié à plusieurs chevaux de l'écurie.
> Un cheval peut avoir plusieurs intervenants du même type (ex : deux vétérinaires).

### Modèle de données (relations)
- Table `intervenant` : id, nom, prénom, type, téléphone, email, adresse
- Table `cheval_intervenant` (liaison) : cheval_id, intervenant_id, depuis, actif, notes
- Table `intervention` (historique médical) : id, cheval_id, intervenant_id, date, type, description, coût, documents joints

### Suivi médical
- [ ] Vaccinations : date, type, prochain rappel automatique
- [ ] Vermifugations : date, produit, prochain rappel
- [ ] Alertes automatiques au propriétaire (J-15, J-7, J-1 avant échéance)
- [ ] Historique complet des interventions par cheval
- [ ] Export PDF de la fiche médicale

### Alimentation
- [ ] Rations journalières (matin, midi, soir)
- [ ] Régimes spéciaux et restrictions
- [ ] Historique des changements de ration
- [ ] Saisie par le soigneur, lecture par le propriétaire

### Performances
- [ ] Enregistrement des entraînements (date, durée, type, intervenant)
- [ ] Résultats de compétitions (date, lieu, classement)
- [ ] Notes et observations du cavalier

### Documents
- [ ] Passeport équin (upload PDF / image)
- [ ] Ordonnances vétérinaires
- [ ] Contrats et documents d'assurance
- [ ] Autres fichiers libres

---

## Droits d'accès par rôle

| Fonctionnalité | Gestionnaire | Soigneur | Propriétaire | Cavalier |
|---|---|---|---|---|
| Fiche cheval | Lecture + écriture | Lecture + écriture | Lecture (son cheval) | — |
| Intervenants | Lecture + écriture | Lecture seule | Lecture (son cheval) | — |
| Suivi médical | Lecture + écriture | Lecture + écriture | Lecture (son cheval) | — |
| Documents médicaux | Lecture + écriture | Lecture + écriture | Lecture (son cheval) | — |
| Alimentation | Lecture + écriture | Lecture + écriture | Lecture (son cheval) | — |
| Performances | Lecture + écriture | — | Lecture (son cheval) | Lecture + écriture |
| Alertes | Configurer | Recevoir | Recevoir | — |

---

## Alertes automatiques (propriétaire)

| Déclencheur | Délai | Canal |
|---|---|---|
| Vaccin à venir | J-15, J-7, J-1 | Push mobile + email |
| Vermifuge à venir | J-15, J-7, J-1 | Push mobile + email |
| Visite véto planifiée | J-1 | Push mobile |
| Soin non effectué | Même jour | Push mobile |

---

## Questions ouvertes
- [ ] Un cheval peut-il avoir plusieurs vétérinaires simultanément ?
- [ ] Le vétérinaire aura-t-il un accès direct à l'application ?
- [ ] Disponibilité hors ligne pour la saisie des soins sur le terrain ?
- [ ] Limite de taille pour les documents uploadés ?
- [ ] Faut-il gérer la co-propriété (plusieurs propriétaires par cheval) ?

---

## Liens
- [Retour aux modules](README.md)
- [Module soins & santé](module-soins.md)
- [Module notifications](module-notifications.md)
- [Module propriétaires & cavaliers](module-personnes.md)


- [ ] Nom, race, robe, sexe
- [ ] Date de naissance
- [ ] Photo
- [ ] Propriétaire associé
- [ ] Box / paddock assigné
- [ ] Statut (présent, absent, vendu…)

### Suivi médical
- [ ] Vaccinations (date, prochain rappel)
- [ ] Vermifugations
- [ ] Visites vétérinaires (date, compte-rendu)
- [ ] Alertes automatiques avant échéance

### Historique
- [ ] Journal des événements par cheval
- [ ] Export PDF de la fiche

## Questions ouvertes
- Faut-il gérer des documents (ordonnances, passeport équin) ?
- Niveau de détail du suivi médical ?

# ADR-003 — Messagerie intégrée sans service tiers

**Date** : 20 mars 2026
**Statut** : Accepté

## Contexte
Le module communication nécessite une messagerie temps réel entre les membres de l'écurie. Plusieurs options ont été évaluées.

## Décision
Construire une **messagerie intégrée** dans l'application, sans dépendance à un service tiers payant.

## Alternatives écartées

### WhatsApp Business API
- Coût par message : $0.03–0.05 par message envoyé par l'application
- Nécessite un Business Solution Provider (intermédiaire payant)
- Dépendance totale à Meta et ses règles d'utilisation
- Templates de messages soumis à approbation Meta

### Matrix / Element (protocole fédéré open source)
- Technologie solide mais complexité d'administration du serveur Synapse élevée
- Surdimensionné pour une écurie avec quelques dizaines d'utilisateurs
- Maintenance serveur supplémentaire non justifiée

## Stack retenue
- **WebSockets** (Socket.io) pour la communication temps réel
- **PostgreSQL** pour le stockage des messages
- **Firebase Cloud Messaging** pour les notifications push mobile (gratuit)

## Conséquences
- Zéro coût par message
- Données privées hébergées sur le serveur de l'écurie
- Développement légèrement plus complexe qu'une intégration tierce
- Fonctionnalités entièrement maîtrisées et évolutives

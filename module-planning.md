# Vue d'ensemble de l'architecture

## Type de solution
Application **web + mobile** (iOS & Android)

## Les 4 couches

| Couche | Rôle |
|---|---|
| Interface utilisateur | Écrans, navigation, notifications |
| Logique métier | Règles, authentification, services |
| Données | Stockage local, base de données, API |
| Infrastructure | Serveurs cloud, déploiement |

## Les 4 environnements

| Environnement | Rôle | Statut |
|---|---|---|
| Local | Développement sur machine | À configurer |
| Staging | Tests avant production | À configurer |
| Production | Application réelle | À configurer |
| CI/CD | Déploiements automatisés | À configurer |

## Services partagés
- **Base de données** : PostgreSQL (à confirmer)
- **Stockage fichiers** : À choisir (S3, Cloudinary…)
- **Authentification** : À choisir (Firebase Auth, Auth0…)
- **Notifications push** : À choisir (Firebase FCM…)

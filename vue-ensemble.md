# ADR-001 — Développer une solution web + mobile

**Date** : 20 mars 2026  
**Statut** : Accepté

## Contexte
La solution doit être accessible depuis le bureau (gestion administrative) et le terrain (soins, planning).

## Décision
Développer une application **web** pour la gestion administrative et une application **mobile** pour une utilisation terrain.

## Alternatives écartées
- Web seul : moins pratique sur le terrain
- Mobile seul : interface limitée pour la gestion administrative

## Conséquences
- Choisir un framework mobile (React Native ou Flutter recommandé)
- Partager un backend commun entre les deux interfaces

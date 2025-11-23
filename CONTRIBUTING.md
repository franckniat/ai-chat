# Guide de Contribution

Bienvenue sur le projet ! Pour assurer une collaboration fluide et éviter les conflits, merci de suivre ces règles.

## 🚫 Règle d'Or
**Ne jamais commiter directement sur la branche `main`.**

## 🔄 Workflow de Développement

### 1. Commencez toujours à jour
Avant de créer une nouvelle branche, assurez-vous d'avoir la dernière version du code :
```bash
git checkout main
git pull origin main
```

### 2. Créez votre branche
Utilisez un nom explicite pour votre branche :
- `feature/nom-de-la-feature` pour les nouveautés
- `fix/nom-du-bug` pour les corrections
- `chore/nom-de-la-tache` pour la maintenance

```bash
git checkout -b feature/ma-nouvelle-page
```

### 3. Développez et Commitez
Faites des commits atomiques (une tâche = un commit) avec des messages clairs.

### 4. Préparer la Pull Request (PR)
**Avant** de pousser votre travail, récupérez les derniers changements de `main` pour résoudre les conflits localement :

```bash
git fetch origin
git merge origin/main
```
*Si vous avez des conflits, résolvez-les dans votre éditeur, puis faites un commit de résolution.*

### 5. Pousser et Créer la PR
```bash
git push origin feature/ma-nouvelle-page
```
Ensuite, ouvrez une Pull Request sur GitHub.

## 📝 Bonnes Pratiques
- **Restez synchronisé** : Si votre tâche dure plusieurs jours, fusionnez `origin/main` dans votre branche régulièrement.
- **Nettoyage** : Supprimez vos branches locales une fois la PR fusionnée.

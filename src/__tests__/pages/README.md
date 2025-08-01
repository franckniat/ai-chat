# Tests de la Page d'Accueil (HomePage)

Ce document décrit les tests implémentés pour la page d'accueil de l'application AI Chat.

## Fichiers de Tests

### 1. `Home.test.tsx` - Tests de Base

Ce fichier contient les tests fondamentaux qui vérifient :

#### Tests de Rendu
- **Rendu sans erreur** : Vérifie que le composant se rend correctement
- **Titre principal** : Vérifie la présence et le contenu du titre H1
- **Texte de description** : Vérifie la présence du texte descriptif

#### Tests des Éléments Interactifs
- **Badge GPT-4o-mini** : Vérifie le lien vers le chat avec le bon href
- **Boutons d'action** : Vérifie la présence des boutons "Try for free" et "Our pricing"

#### Tests de Structure
- **Conteneur principal** : Vérifie les classes CSS du conteneur principal
- **Texte "ai" stylisé** : Vérifie le styling spécial du mot "ai"
- **Emoji fusée** : Vérifie la présence de l'emoji dans le badge
- **Décoration soulignée** : Vérifie l'élément de décoration sous "ai"

#### Tests de Layout
- **Padding responsive** : Vérifie les classes de padding responsives
- **Layout centré** : Vérifie la structure du layout centré
- **Icônes SVG** : Vérifie la présence des icônes
- **Contenu textuel complet** : Vérifie tous les textes principaux

### 2. `Home.advanced.test.tsx` - Tests Avancés

Ce fichier contient des tests plus sophistiqués qui vérifient :

#### Tests de Hiérarchie
- **Structure DOM complète** : Vérifie l'organisation hiérarchique des éléments
- **Placement des éléments** : Vérifie que les éléments sont dans les bons conteneurs

#### Tests d'Accessibilité
- **Attributs d'accessibilité** : Vérifie les attributs ARIA et de navigation
- **Visibilité du contenu** : Vérifie que tous les éléments sont visibles

#### Tests de Design Responsive
- **Classes responsive** : Vérifie les classes CSS pour différentes tailles d'écran
- **Structure des boutons** : Vérifie le styling et la structure des boutons

#### Tests de Positionnement
- **Décoration gradient** : Vérifie le positionnement précis de la décoration
- **Centrage et espacement** : Vérifie les gaps et l'alignement

#### Tests de Layout Complet
- **Structure complète** : Vérifie l'imbrication correcte de tous les conteneurs

## Configuration des Tests

### Outils Utilisés
- **Vitest** : Framework de test principal
- **@testing-library/react** : Utilitaires de test pour React
- **@testing-library/jest-dom** : Matchers personnalisés pour le DOM
- **@testing-library/user-event** : Simulation d'interactions utilisateur

### Configuration
- **Environment** : jsdom pour simuler le navigateur
- **Setup** : `src/test-setup.ts` pour configurer jest-dom
- **Mocks** : Mock de Next.js Link pour les tests

### Fichiers de Configuration
```typescript
// vitest.config.mts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})

// src/test-setup.ts
import '@testing-library/jest-dom/vitest'
```

## Commandes de Test

```bash
# Lancer tous les tests de la page d'accueil
pnpm test src/components/__test__/pages/

# Lancer les tests en mode watch
pnpm test src/components/__test__/pages/Home.test.tsx

# Lancer les tests avancés
pnpm test src/components/__test__/pages/Home.advanced.test.tsx

# Lancer tous les tests une seule fois
pnpm test src/components/__test__/pages/ --run
```

## Coverage des Tests

Les tests couvrent :
- ✅ Rendu du composant
- ✅ Contenu textuel
- ✅ Liens et navigation
- ✅ Boutons et interactions
- ✅ Structure CSS et classes
- ✅ Responsive design
- ✅ Accessibilité
- ✅ Hiérarchie DOM
- ✅ Positionnement des éléments

## Bonnes Pratiques Implémentées

1. **Cleanup automatique** : Utilisation de `beforeEach(() => cleanup())`
2. **Sélecteurs robustes** : Utilisation de `getByRole`, `getByText` pour la stabilité
3. **Tests unitaires focalisés** : Chaque test vérifie un aspect spécifique
4. **Mocks appropriés** : Mock de Next.js Link pour isoler les tests
5. **Tests d'accessibilité** : Vérification des attributs ARIA et de la navigation
6. **Tests responsive** : Vérification des classes CSS responsive

## Maintenance

Pour maintenir ces tests :
1. Mettre à jour les tests si le contenu de la page change
2. Ajouter de nouveaux tests pour de nouvelles fonctionnalités
3. Vérifier que les sélecteurs restent stables
4. Maintenir la couverture de test à un niveau élevé

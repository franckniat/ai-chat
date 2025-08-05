# 🤖 Niato AI Chat

Une application de chat alimentée par l'IA avec support multi-modèles, authentification complète et système d'artifacts pour l'affichage de code interactif.

## ✨ Fonctionnalités

- 🤖 **Chat IA multi-modèles** - Support OpenAI GPT-4 et autres modèles
- 🔐 **Authentification complète** - Google, GitHub, email avec vérification
- 📁 **Gestion des conversations** - Historique et organisation des chats
- 🎨 **Artifacts interactifs** - Affichage et rendu de code en temps réel
- 🌙 **Mode sombre/clair** - Interface adaptative
- 📱 **Design responsive** - Optimisé mobile et desktop
- 🔧 **Upload de fichiers** - Partage et traitement de documents
- ⚡ **Interface moderne** - Built avec Next.js 15 et Tailwind CSS

## 🛠️ Stack Technique

### Frontend
- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utilitaire
- **Radix UI** - Composants accessibles
- **React Hook Form** - Gestion des formulaires
- **Framer Motion** - Animations fluides

### Backend & Base de données
- **PostgreSQL** - Base de données relationnelle
- **Prisma** - ORM moderne
- **Better Auth** - Authentification sécurisée
- **AI SDK** - Intégration IA simplifiée

### IA & Outils
- **OpenAI API** - Modèles GPT-4/3.5
- **React Syntax Highlighter** - Coloration syntaxique
- **React Markdown** - Rendu Markdown
- **UploadThing** - Upload de fichiers

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- PostgreSQL
- pnpm (recommandé) ou npm

### 1. Cloner le projet
```bash
git clone https://github.com/franckniat/ai-chat.git
cd ai-chat
```

### 2. Installer les dépendances
```bash
pnpm install
# ou
npm install
```

### 3. Configuration environnement

Créer un fichier `.env` à la racine :

```env
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/ai-chat"

# Authentification
BETTER_AUTH_SECRET="votre-secret-auth-securise"
BETTER_AUTH_URL="http://localhost:3000"
BASE_URL="http://localhost:3000"
EMAIL_VERIFICATION_CALLBACK_URL="http://localhost:3000/email-verified"

# OAuth - Google
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"

# OAuth - GitHub
GITHUB_CLIENT_ID="votre-github-client-id"
GITHUB_CLIENT_SECRET="votre-github-client-secret"

# Email (Resend)
RESEND_API_KEY="votre-resend-api-key"

# Upload (UploadThing)
UPLOADTHING_TOKEN="votre-uploadthing-token"

# IA
OPENAI_API_KEY="votre-openai-api-key"

# GitHub (optionnel)
GITHUB_TOKEN="votre-github-token"
```

### 4. Base de données
```bash
# Générer le client Prisma
pnpm prisma generate

# Appliquer les migrations
pnpm prisma db push

# (Optionnel) Ouvrir Prisma Studio
pnpm prisma studio
```

### 5. Lancer en développement
```bash
pnpm dev
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du projet

```
src/
├── app/                    # App Router Next.js
│   ├── (auth)/            # Routes d'authentification
│   ├── (chat)/            # Interface de chat
│   ├── (dashboard)/       # Paramètres utilisateur
│   ├── (home)/            # Page d'accueil
│   └── api/               # API routes
├── components/            # Composants React
│   ├── auth/              # Formulaires d'auth
│   ├── chat/              # Interface chat + artifacts
│   └── ui/                # Composants UI réutilisables
├── lib/                   # Utilitaires et configuration
├── hooks/                 # Custom React hooks
├── providers/             # Context providers
├── schemas/               # Schémas de validation
└── types/                 # Types TypeScript
```

## 🎨 Fonctionnalités Clés

### Système d'Artifacts
Les artifacts permettent d'afficher du code et du HTML de manière interactive :

```markdown
<artifact id="example" type="code" language="tsx" title="Composant React">
const Button = ({ children }) => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded">
    {children}
  </button>
);
</artifact>
```

### Types d'artifacts supportés :
- `type="code"` - Code avec coloration syntaxique
- `type="html"` - Rendu HTML interactif
- `type="markdown"` - Markdown formaté

### Authentification
- **Connexion locale** avec email/mot de passe
- **OAuth** Google et GitHub
- **Vérification email** automatique
- **Réinitialisation** de mot de passe

### Chat IA
- **Conversations persistantes** en base de données
- **Streaming** des réponses en temps réel
- **Historique** complet des échanges
- **Interface intuitive** avec sidebar

## 🧪 Tests

```bash
# Lancer les tests
pnpm test

# Tests en mode watch
pnpm test --watch
```

## 🔧 Scripts disponibles

```bash
pnpm dev          # Développement
pnpm build        # Build production
pnpm start        # Démarrer en production
pnpm lint         # Linter ESLint
pnpm test         # Tests Vitest
```

## 🌐 Déploiement

### Vercel (recommandé)
1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Variables d'environnement production
Assurez-vous de configurer toutes les variables d'environnement en production, notamment :
- `DATABASE_URL` (base de données production)
- `BETTER_AUTH_URL` (URL de production)
- `BASE_URL` (URL de production)
- Toutes les clés API

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez que toutes les variables d'environnement sont configurées
2. Assurez-vous que PostgreSQL est démarré
3. Vérifiez les logs de développement (`pnpm dev`)
4. Consultez la documentation des services tiers (OpenAI, Resend, etc.)

---

Développé avec ❤️ par [franckniat](https://github.com/franckniat)
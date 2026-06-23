# Juste Connecté — Boutique e-commerce

Smartphones reconditionnés pour les Antilles et la Guyane françaises.

**Stack :** Next.js 14 (App Router) · TypeScript · Tailwind CSS v3 · Supabase · TanStack Query

---

## Démarrage rapide

### 1. Cloner le projet
```bash
git clone https://github.com/successnfb/justeconnecte2.git
cd justeconnecte2
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer Supabase

Créer un projet sur [supabase.com](https://supabase.com), puis copier vos clés dans `.env.local` :

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
```

### 4. Initialiser la base de données

Dans l'éditeur SQL de Supabase, exécuter dans l'ordre :

1. `supabase/migrations/001_schema.sql` — crée les tables et les politiques RLS
2. `supabase/migrations/002_seed.sql` — insère les données de démo (zones, marques, produits, variantes, prix)

### 5. Lancer en développement
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Structure du projet

```
app/
├── layout.tsx              — layout racine (providers, font)
├── page.tsx                — page d'accueil
├── boutique/page.tsx       — catalogue avec filtres
├── produits/[slug]/        — fiche produit
│   ├── page.tsx            — Server Component (fetch + metadata)
│   └── ProductDetail.tsx   — Client Component (sélecteurs variantes)
├── panier/page.tsx         — panier (état localStorage)
└── admin/
    ├── layout.tsx          — auth guard + sidebar
    ├── page.tsx            — dashboard avec stats
    ├── produits/           — CRUD produits
    └── stock/page.tsx      — gestion stock inline

components/
├── SiteShell.tsx           — Header + Footer (masqué sur /admin/*)
├── Header.tsx              — nav glassmorphism + panier + zone
├── Footer.tsx
├── AnnouncementBar.tsx
├── ZoneSelector.tsx        — modal sélection zone géographique
├── ProductCard.tsx         — carte produit avec prix par zone
├── BrandLogoStrip.tsx      — marquee logos marques
└── ui/ProductForm.tsx      — formulaire produit + variantes admin

contexts/
├── ZoneContext.tsx          — zone active (localStorage)
└── CartContext.tsx          — panier (localStorage)

lib/
├── supabase.ts             — client browser (@supabase/ssr)
├── supabase-server.ts      — client server (Server Components)
├── types.ts                — types TypeScript partagés
└── utils.ts                — formatPrice, slugify, getStockStatus
```

---

## Déploiement Vercel

```bash
# Installer la CLI Vercel
npm i -g vercel

# Déployer
vercel
```

Ajouter les variables d'environnement dans le dashboard Vercel :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Espace admin

Accessible sur `/admin`. Protégé par Supabase Auth (email + mot de passe).

Créer un compte admin dans le dashboard Supabase : **Authentication → Users → Invite user**.

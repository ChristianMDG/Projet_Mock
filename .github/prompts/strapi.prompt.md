---
agent: agent
---

# 🏗 Strapi CMS Development Guide - Taxibrousse

**Note:** Current Strapi guidance targets v5+. Avoid legacy controller/service overrides from older Strapi versions. Use `cms.axios.ts` and `VITE_CMS_*` env variables for frontend access; never expose admin tokens.

## 🤖 Agent Instructions

- Keep code minimal; reuse `factories.createCoreController/Service` 
- Never expose admin tokens to frontend; use API Tokens with minimal scopes
- Use provider plugins (Cloudinary) via config; avoid re-implementing upload logic
- Provide smallest working controller/service override when needed
- Use positive conditions for validation logic
- Current version: **Strapi 5.23.6** with PostgreSQL + Cloudinary + i18n (fr/en/mg)
- Access via `cms.axios.ts` from frontend using `VITE_CMS_*` env variables

## 🎯 When to Use Strapi

### ✅ Use Strapi For
- Marketing content (FAQs, pages, news)
- Dynamic sections (page.* components)
- Multilingual static content
- SEO metadata
- Media assets (via Cloudinary)

### ❌ Don't Use Strapi For
- Transactional data (reservations, payments)
- Real-time data (seat availability)
- Business logic (booking algorithms)
- Main app authentication

## 📁 CMS Structure

```
cms/
├── config/
│   ├── plugins.ts      # Cloudinary + i18n config
│   ├── database.ts     # PostgreSQL connection
│   └── middlewares.ts  # Custom middlewares
├── src/
│   ├── api/
│   │   ├── dynamic-page/     # Pages dynamiques
│   │   ├── hero-content/     # Contenu hero
│   │   ├── page-content/     # Contenu de page
│   │   └── payment-method/   # Méthodes de paiement
│   ├── components/
│   │   └── page/             # Composants de section (*.json)
│   └── utils/
│       └── cloudinary.ts     # Utilitaires Cloudinary
└── content/                  # Données exportées
```

## 🧩 Dynamic Page System

### Content Type Principal
```
cms/src/api/dynamic-page/content-types/dynamic-page/schema.json
```

### Composants de Section
Tous dans `cms/src/components/page/`:

| Composant | Description |
|-----------|-------------|
| `page-header` | En-tête avec titre, sous-titre, alerte |
| `call-to-action` | CTA avec bouton |
| `safety-measures` | Liste de mesures avec icônes |
| `insurance-coverage` | Tableau d'assurances |
| `faq-section` | FAQ accordéon |
| `about-us-section` | À propos avec paragraphes |
| `popular-routes` | Tableau des routes |
| `current-promotions` | Cartes de promotions |
| `help-center-section` | Centre d'aide |
| `service-types` | Types de services |
| `contact-section` | Informations de contact |
| `legal-content` | Contenu légal |
| `destinations-grid` | Grille de destinations |
| `customer-testimonials` | Témoignages clients |
| `why-choose-us` | Pourquoi nous choisir |
| `statistics-section` | Statistiques |
| `mission-section` | Mission |
| `values-section` | Valeurs |
| `network-section` | Réseau |
| `payment-section` | Section paiement |
| `section-reference` | Référence à section partagée |

## 🔧 Créer un Nouveau Composant

### 1. Créer le fichier JSON
```json
// cms/src/components/page/my-section.json
{
  "collectionName": "components_page_my_sections",
  "info": {
    "displayName": "My Section",
    "description": "Description",
    "icon": "star"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "items": {
      "type": "component",
      "repeatable": true,
      "component": "page.my-item"
    },
    "backgroundColor": { "type": "string" },
    "containerMaxWidth": {
      "type": "enumeration",
      "enum": ["xs", "sm", "md", "lg", "xl"],
      "default": "lg"
    }
  }
}
```

### 2. Ajouter au Dynamic Page
```json
// cms/src/api/dynamic-page/content-types/dynamic-page/schema.json
{
  "attributes": {
    "sections": {
      "type": "dynamiczone",
      "components": [
        "page.my-section",
        // ... autres
      ]
    }
  }
}
```

### 3. Redémarrer Strapi
```bash
cd cms && npm run develop
```

## 📡 Frontend Integration

### API Client
```typescript
// front/src/api/cms.axios.ts
import axios from 'axios';

const cmsAxios = axios.create({
  baseURL: import.meta.env.VITE_CMS_API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_CMS_API_KEY}`,
  },
});

export default cmsAxios;
```

### React Query Hook
```typescript
// front/src/hooks/dynamic-page.hooks.ts
export function useDynamicPageBySlug(slug: string) {
  const { language } = useTranslation();
  return useQuery({
    queryKey: ['dynamic-page', slug, language],
    queryFn: () => getDynamicPageBySlug(slug, language),
    staleTime: 5 * 60 * 1000,
  });
}
```

### Types Frontend
```typescript
// front/src/api/dynamic-page.api.ts
export interface MySection {
  id: number;
  __component: 'page.my-section';
  title: string;
  items: MyItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}
```

## 🔧 Custom Controllers

```typescript
// cms/src/api/dynamic-page/controllers/dynamic-page.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::dynamic-page.dynamic-page', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;
    
    const page = await strapi.entityService.findMany('api::dynamic-page.dynamic-page', {
      filters: { slug },
      locale: locale || 'fr',
      populate: {
        pageHeader: true,
        sections: { populate: '*' },
        callToAction: true,
        featuredImage: true,
      },
    });
    
    return { data: page[0] || null };
  },
}));
```

## 🔐 Security & Permissions

| Concern | Recommendation |
|---------|----------------|
| Public content | Enable only read for Public role |
| Admin API keys | Use API Tokens (read-only) |
| Draft vs Published | Use `draftAndPublish`; query only published |
| Rate limiting | Add reverse proxy or plugin |
| Upload restrictions | Limit formats + size in provider |

## 🌍 i18n Configuration

```typescript
// cms/config/plugins.ts
export default ({ env }) => ({
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'fr',
      locales: ['fr', 'en', 'mg'],
    },
  },
});
```

### Champs Localisés
```json
{
  "title": {
    "type": "string",
    "pluginOptions": { "i18n": { "localized": true } }
  }
}
```

## 📷 Cloudinary Configuration

```typescript
// cms/config/plugins.ts
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: { folder: 'taxibrousse/cms' },
      },
    },
  },
});
```

## 🧪 Testing

### Test API Responses
```typescript
// Mock Strapi response shapes
const mockDynamicPage = {
  data: {
    id: 1,
    slug: 'test-page',
    sections: [
      { __component: 'page.faq-section', title: 'FAQ', faqs: [] }
    ]
  }
};
```

### Validate Unpublished
- Ensure unpublished entries don't appear in production
- Add filter: `filters: { publishedAt: { $notNull: true } }`

## 📋 Checklist Nouveau Composant

- [ ] Fichier JSON créé dans `cms/src/components/page/`
- [ ] Ajouté au schema `dynamic-page`
- [ ] Strapi redémarré
- [ ] Type TypeScript ajouté (`front/src/api/dynamic-page.api.ts`)
- [ ] Constante ajoutée (`front/src/constants/section.types.ts`)
- [ ] Composant React créé (`front/src/components/section/`)
- [ ] Skeleton créé
- [ ] Enregistré dans `Section.tsx`
- [ ] Testé avec données réelles

## 📚 Références

- **Dynamic Pages**: `/.github/instructions/README-DYNAMIC-PAGES.md`
- **Cloudinary**: `/.github/prompts/cloudinary.prompt.md`
- **i18n**: `/.github/prompts/label.prompt.md`

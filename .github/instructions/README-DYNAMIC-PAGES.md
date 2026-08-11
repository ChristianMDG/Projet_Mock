# Système de Pages Dynamiques - Taxibrousse

Ce système permet de créer et gérer des pages dynamiques depuis le CMS Strapi avec des sections réutilisables.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CMS (Strapi)                            │
│  cms/src/api/dynamic-page/     → Content Type principal         │
│  cms/src/components/page/*.json → Composants de section         │
└─────────────────────────────────────────────────────────────────┘
                              ↓ API
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend (React)                          │
│  front/src/api/dynamic-page.api.ts    → Types & API calls       │
│  front/src/constants/section.types.ts → SECTION_TYPES enum      │
│  front/src/components/section/*.tsx   → Composants React        │
│  front/src/context/SectionProvider.tsx → Cache des sections     │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Structure des Fichiers

### CMS (Strapi)
```
cms/src/
├── api/
│   └── dynamic-page/
│       └── content-types/dynamic-page/schema.json  # Type principal
└── components/
    └── page/
        ├── page-header.json          # En-tête de page
        ├── call-to-action.json       # CTA avec bouton
        ├── safety-measures.json      # Mesures de sécurité
        ├── insurance-coverage.json   # Couverture assurance
        ├── faq-section.json          # FAQ accordéon
        ├── about-us-section.json     # À propos
        ├── popular-routes.json       # Routes populaires
        ├── current-promotions.json   # Promotions
        ├── help-center-section.json  # Centre d'aide
        ├── service-types.json        # Types de services
        ├── contact-section.json      # Contact
        ├── legal-content.json        # Contenu légal
        ├── destinations-grid.json    # Grille destinations
        ├── customer-testimonials.json # Témoignages
        ├── why-choose-us.json        # Pourquoi nous choisir
        ├── statistics-section.json   # Statistiques
        ├── mission-section.json      # Mission
        ├── values-section.json       # Valeurs
        ├── network-section.json      # Réseau
        ├── payment-section.json      # Paiement
        └── section-reference.json    # Référence à section partagée
```

### Frontend (React)
```
front/src/
├── api/
│   └── dynamic-page.api.ts           # Types & fonctions API
├── constants/
│   └── section.types.ts              # SECTION_TYPES enum
├── components/
│   └── section/
│       ├── Section.tsx               # Renderer principal
│       ├── PageHeader.tsx
│       ├── CallToAction.tsx
│       ├── SafetyMeasures.tsx
│       ├── InsuranceCoverage.tsx
│       ├── FaqSection.tsx
│       ├── AboutUs.tsx
│       ├── PopularRoutes.tsx
│       ├── CurrentPromotions.tsx
│       ├── HelpCenterSection.tsx
│       ├── ServiceTypes.tsx
│       ├── Contact.tsx
│       ├── LegalContent.tsx
│       ├── DestinationsGrid.tsx
│       ├── Testimonials.tsx
│       ├── WhyChooseUs.tsx
│       ├── StatisticsSection.tsx
│       ├── MissionSection.tsx
│       ├── ValuesSection.tsx
│       ├── NetworkSection.tsx
│       ├── PaymentSection.tsx
│       ├── index.ts
│       └── skeleton/                 # Composants skeleton
├── context/
│   └── SectionProvider.tsx           # Cache sections partagées
├── hooks/
│   └── dynamic-page.hooks.ts         # React Query hooks
└── pages/
    └── DynamicPage.tsx               # Page viewer
```

## 🚀 Ajouter une Nouvelle Section

### Étape 1: Créer le Composant CMS

Créer `cms/src/components/page/my-new-section.json`:
```json
{
  "collectionName": "components_page_my_new_sections",
  "info": {
    "displayName": "My New Section",
    "description": "Description de la section",
    "icon": "star"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "subtitle": {
      "type": "string",
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "items": {
      "type": "component",
      "repeatable": true,
      "component": "page.my-item"
    },
    "backgroundColor": {
      "type": "string"
    },
    "containerMaxWidth": {
      "type": "enumeration",
      "enum": ["xs", "sm", "md", "lg", "xl"],
      "default": "lg"
    }
  }
}
```

### Étape 2: Ajouter au Schema Dynamic Page

Modifier `cms/src/api/dynamic-page/content-types/dynamic-page/schema.json`:
```json
{
  "attributes": {
    "sections": {
      "type": "dynamiczone",
      "components": [
        "page.my-new-section",
        // ... autres composants existants
      ]
    }
  }
}
```

### Étape 3: Ajouter le Type Frontend

Dans `front/src/api/dynamic-page.api.ts`:
```typescript
export interface MyItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface MyNewSection {
  id: number;
  __component: 'page.my-new-section';
  title: string;
  subtitle?: string;
  items: MyItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}

// Ajouter au type union
export type DynamicPageSection =
  | MyNewSection
  | SafetyMeasures
  // ... autres types
```

### Étape 4: Ajouter la Constante

Dans `front/src/constants/section.types.ts`:
```typescript
export const SECTION_TYPES = {
  MY_NEW_SECTION: 'page.my-new-section',
  // ... autres types
} as const;

export type SectionType = typeof SECTION_TYPES[keyof typeof SECTION_TYPES];
```

### Étape 5: Créer le Composant React

Créer `front/src/components/section/MyNewSection.tsx`:
```tsx
import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import type { MyNewSection as MyNewSectionType } from '@/api/dynamic-page.api';
import { IconMapper } from '@/shared/IconMapper';

interface MyNewSectionProps {
  section: MyNewSectionType;
}

const MyNewSection: React.FC<MyNewSectionProps> = ({ section }) => {
  return (
    <Box sx={{ py: 6, bgcolor: section.backgroundColor || 'background.default' }}>
      <Container maxWidth={section.containerMaxWidth || 'lg'}>
        <Typography variant="h4" gutterBottom align="center">
          {section.title}
        </Typography>
        {section.subtitle && (
          <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            {section.subtitle}
          </Typography>
        )}
        <Grid container spacing={3}>
          {section.items.map(item => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardContent>
                  <IconMapper icon={item.icon} sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MyNewSection;
```

### Étape 6: Créer le Skeleton

Créer `front/src/components/section/skeleton/MyNewSectionSkeleton.tsx`:
```tsx
import React from 'react';
import { Box, Container, Skeleton, Grid, Card, CardContent } from '@mui/material';

const MyNewSectionSkeleton: React.FC = () => (
  <Box sx={{ py: 6 }}>
    <Container maxWidth="lg">
      <Skeleton variant="text" width="40%" height={40} sx={{ mx: 'auto', mb: 4 }} />
      <Grid container spacing={3}>
        {[1, 2, 3].map(i => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="100%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default MyNewSectionSkeleton;
```

### Étape 7: Enregistrer dans Section.tsx

Dans `front/src/components/section/Section.tsx`:
```typescript
import MyNewSection from './MyNewSection';
import { MyNewSectionSkeleton } from './skeleton';

const SECTION_COMPONENTS: Record<string, SectionComponent> = {
  [SECTION_TYPES.MY_NEW_SECTION]: MyNewSection as SectionComponent,
  // ... autres composants
};

const SECTION_SKELETONS: Record<string, SkeletonComponent> = {
  [SECTION_TYPES.MY_NEW_SECTION]: MyNewSectionSkeleton,
  // ... autres skeletons
};
```

### Étape 8: Exporter

Dans `front/src/components/section/index.ts`:
```typescript
export { default as MyNewSection } from './MyNewSection';
```

Dans `front/src/components/section/skeleton/index.ts`:
```typescript
export { default as MyNewSectionSkeleton } from './MyNewSectionSkeleton';
```

## 🔄 Sections Partagées (Section Reference)

Le système supporte les sections partagées via `page.section-reference`. Une page "template" (`page-template`) contient les sections réutilisables.

### Utilisation
1. Créer une page avec slug `page-template` dans Strapi
2. Ajouter les sections partagées
3. Dans d'autres pages, utiliser `Section Reference` avec le `sectionType` correspondant

### Fonctionnement
```typescript
// SectionProvider.tsx charge page-template au démarrage
const { data } = useDynamicPageBySlug('page-template');

// Section.tsx vérifie si c'est une référence
if (section.__component === 'page.section-reference') {
  const cachedSection = getSectionByType(section.sectionType);
  // Render la section depuis le cache
}
```

## 🌍 Internationalisation

Toutes les sections supportent i18n via Strapi:
- Langues: `fr` (défaut), `en`, `mg`
- Les champs avec `pluginOptions.i18n.localized: true` sont traduits
- Le frontend passe `locale` dans les requêtes API

## 🎨 Conventions de Style

### Props Communes
```typescript
interface CommonSectionProps {
  backgroundColor?: string;      // Couleur de fond
  containerMaxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Largeur max
}
```

### Icônes
Utiliser les noms d'icônes Material UI:
- `DirectionsBus`, `Person`, `Shield`, `Phone`, `Email`, etc.
- Le composant `IconMapper` convertit le nom en icône

### Espacement
```tsx
<Box sx={{ py: 6 }}>  {/* Padding vertical standard */}
  <Container maxWidth="lg">
    {/* Contenu */}
  </Container>
</Box>
```

## 🧪 Test Local

1. Démarrer le CMS: `cd cms && npm run develop`
2. Créer/modifier une page dans Strapi Admin
3. Démarrer le frontend: `cd front && npm run dev`
4. Accéder à `/page/{slug}` pour voir la page

## 📋 Checklist Nouvelle Section

- [ ] Composant CMS créé (`cms/src/components/page/*.json`)
- [ ] Ajouté au schema dynamic-page
- [ ] Type TypeScript ajouté (`dynamic-page.api.ts`)
- [ ] Constante ajoutée (`section.types.ts`)
- [ ] Composant React créé (`components/section/*.tsx`)
- [ ] Skeleton créé (`components/section/skeleton/*.tsx`)
- [ ] Enregistré dans `Section.tsx`
- [ ] Exporté dans `index.ts`
- [ ] Testé avec données réelles

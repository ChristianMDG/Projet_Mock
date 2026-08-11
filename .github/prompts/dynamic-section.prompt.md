---
agent: agent
---

# 🧩 Guide de Création de Section Dynamique - Taxibrousse
**Note:** Ensure CMS components follow Strapi 5 dynamic-zone patterns and frontend types match `front/src/api/dynamic-page.api.ts`. Avoid legacy Strapi or frontend patterns.

## 🤖 Agent Instructions

Ce guide décrit le processus complet pour ajouter une nouvelle section dynamique au système CMS Strapi 5.23.6 et au frontend React 19.

**Objectifs**:
- Code minimal et propre
- Utiliser des conditions positives et des retours précoces
- **TOUJOURS formater le frontend**: `cd front && npm run format`
- Importer depuis `@/` pour une résolution de modules propre
- Ajouter au SECTION_TYPES pour la cohérence

## 📋 Checklist Complète

### 1. CMS - Composants Strapi

#### 1.1 Créer le composant item (si nécessaire)
```json
// cms/src/components/page/my-item.json
{
  "collectionName": "components_page_my_items",
  "info": {
    "displayName": "Mon Élément",
    "description": "Description de l'élément",
    "icon": "check"
  },
  "options": {},
  "attributes": {
    "icon": {
      "type": "enumeration",
      "enum": ["Info", "Help", "Star", "..."],
      "default": "Info",
      "required": true
    },
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 200,
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "description": {
      "type": "text",
      "required": true,
      "maxLength": 500,
      "pluginOptions": { "i18n": { "localized": true } }
    }
  }
}
```

#### 1.2 Créer le composant section
```json
// cms/src/components/page/my-section.json
{
  "collectionName": "components_page_my_sections",
  "info": {
    "displayName": "Ma Section",
    "description": "Description de la section",
    "icon": "star"
  },
  "options": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 200,
      "default": "Titre par défaut",
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "items": {
      "type": "component",
      "repeatable": true,
      "component": "page.my-item"
    }
  }
}
```

#### 1.3 Ajouter au schema dynamic-page
```json
// cms/src/api/dynamic-page/content-types/dynamic-page/schema.json
{
  "attributes": {
    "sections": {
      "components": [
        // ... existants
        "page.my-section"
      ]
    }
  }
}
```

#### 1.4 Ajouter au section-reference
```json
// cms/src/components/page/section-reference.json
{
  "attributes": {
    "sectionTitle": {
      "enum": [
        // ... existants
        "My Section"
      ]
    },
    "sectionType": {
      "enum": [
        // ... existants
        "page.my-section"
      ]
    }
  }
}
```

### 2. CMS - Traductions Admin

#### 2.1 Ajouter les traductions FR et EN
```typescript
// cms/src/admin/app.tsx
translations: {
  fr: {
    // My Section
    'content-manager.components.page.my-section.title': 'Titre',
    'content-manager.components.page.my-section.items': 'Éléments',
    
    // My Item
    'content-manager.components.page.my-item.icon': 'Icône',
    'content-manager.components.page.my-item.title': 'Titre',
    'content-manager.components.page.my-item.description': 'Description',
  },
  en: {
    // My Section
    'content-manager.components.page.my-section.title': 'Title',
    'content-manager.components.page.my-section.items': 'Items',
    
    // My Item
    'content-manager.components.page.my-item.icon': 'Icon',
    'content-manager.components.page.my-item.title': 'Title',
    'content-manager.components.page.my-item.description': 'Description',
  }
}
```

### 3. CMS - Données de Population

#### 3.1 Créer le fichier mutation
```json
// cms/content/my-section.mutation.json
{
  "description": "My Section mutation for page-template dynamic zone",
  "collection": "api::dynamic-page.dynamic-page",
  "slug": "page-template",
  "component": "page.my-section",
  "locales": {
    "fr": {
      "__component": "page.my-section",
      "title": "Titre en français",
      "items": [
        { "icon": "Info", "title": "Élément 1", "description": "Description 1" }
      ]
    },
    "en": {
      "__component": "page.my-section",
      "title": "Title in English",
      "items": [
        { "icon": "Info", "title": "Item 1", "description": "Description 1" }
      ]
    },
    "mg": {
      "__component": "page.my-section",
      "title": "Lohateny amin'ny teny malagasy",
      "items": [
        { "icon": "Info", "title": "Singa 1", "description": "Famaritana 1" }
      ]
    }
  }
}
```

### 4. Frontend - Types TypeScript

#### 4.1 Ajouter à SECTION_TYPES
```typescript
// front/src/constants/section.types.ts
export const SECTION_TYPES = {
  MY_SECTION: 'page.my-section',
  // ... autres sections existantes
} as const;

export type SectionType = typeof SECTION_TYPES[keyof typeof SECTION_TYPES];
```

#### 4.2 Créer l'interface TypeScript

#### 4.1 Ajouter les interfaces
```typescript
// front/src/api/dynamic-page.api.ts

export interface MyItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface MySection {
  id: number;
  __component: 'page.my-section';
  title: string;
  items: MyItem[];
}

// Ajouter au type union DynamicPageSection
export type DynamicPageSection =
  | // ... existants
  | MySection;
```

### 5. Frontend - Constantes

#### 5.1 Ajouter la constante de type
```typescript
// front/src/constants/section.types.ts
export const SECTION_TYPES = {
  // ... existants
  MY_SECTION: 'page.my-section',
} as const;
```

### 6. Frontend - Composant React

#### 6.1 Créer le composant
```typescript
// front/src/components/section/MySection.tsx
import React from 'react';
import { Box, Card, CardContent, Grid, Typography, type SxProps, type Theme } from '@mui/material';
import { Icon } from '@/shared/IconMapper';
import type { MyItem, MySection as MySectionType } from '@/api/dynamic-page.api';

interface MySectionProps {
  section: MySectionType;
  sx?: SxProps<Theme>;
}

const MySection: React.FC<MySectionProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section={section.__component}>
      <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 4 }}>
        {section.title}
      </Typography>
      <Grid container spacing={3}>
        {section.items.map((item: MyItem) => (
          <Grid size={{ xs: 12, md: 6 }} key={`item-${item.id}`}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                  <Icon iconName={item.icon} color="primary" />
                  <Typography variant="h6" component="h3">
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MySection;
```

#### 6.2 Créer le skeleton
```typescript
// front/src/components/section/skeleton/MySectionSkeleton.tsx
import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const MySectionSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map(index => (
        <Grid key={index} size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width="60%" height={28} />
              </Box>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default MySectionSkeleton;
```

### 7. Frontend - Enregistrement

#### 7.1 Exporter dans index.ts
```typescript
// front/src/components/section/index.ts
export { default as MySection } from './MySection';

// front/src/components/section/skeleton/index.ts
export { default as MySectionSkeleton } from './MySectionSkeleton';
```

#### 7.2 Enregistrer dans Section.tsx
```typescript
// front/src/components/section/Section.tsx

// Imports
import MySection from './MySection';
import { MySectionSkeleton } from './skeleton';

// Mappings
const SECTION_COMPONENTS: Record<string, SectionComponent> = {
  // ... existants
  [SECTION_TYPES.MY_SECTION]: MySection as SectionComponent,
};

const SECTION_SKELETONS: Record<string, SkeletonComponent> = {
  // ... existants
  [SECTION_TYPES.MY_SECTION]: MySectionSkeleton,
};
```

## 🔧 Icônes Disponibles

Référez-vous à `front/src/shared/IconMapper.tsx` pour la liste des icônes:
- AccessTime, AcUnit, Build, Business, CalendarMonth
- CheckCircle, CreditCard, EventSeat, Help, Info
- LocalOffer, Luggage, Payment, Person, Schedule
- Security, Shield, Star, Verified, etc.

## 📁 Structure des Fichiers

```
cms/
├── src/
│   ├── components/page/
│   │   ├── my-item.json          # Composant item
│   │   └── my-section.json       # Composant section
│   ├── api/dynamic-page/
│   │   └── content-types/dynamic-page/schema.json
│   └── admin/app.tsx             # Traductions
└── content/
    └── my-section.mutation.json  # Données de population

front/
├── src/
│   ├── api/dynamic-page.api.ts   # Types TypeScript
│   ├── constants/section.types.ts # Constantes
│   └── components/section/
│       ├── MySection.tsx         # Composant React
│       ├── index.ts              # Export
│       ├── Section.tsx           # Enregistrement
│       └── skeleton/
│           ├── MySectionSkeleton.tsx
│           └── index.ts
```

## ⚠️ Points Importants

1. **Redémarrer Strapi** après modification des schemas JSON
2. **Vérifier les icônes** dans IconMapper.tsx avant utilisation
3. **Tester les 3 locales** (fr, en, mg) pour les traductions
4. **Utiliser section-reference** pour réutiliser les sections entre pages

## 📚 Références

- Strapi Guide: `/.github/prompts/strapi.prompt.md`
- Dynamic Pages: `/.github/instructions/README-DYNAMIC-PAGES.md`
- Icônes: `front/src/shared/IconMapper.tsx`

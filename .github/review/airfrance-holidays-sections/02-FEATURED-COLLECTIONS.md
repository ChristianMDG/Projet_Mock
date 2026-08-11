# Featured Collections Section

## Description

Section présentant des collections thématiques de voyages/services avec images, catégories et appels à l'action. Inspirée de "Nos collections du moment" d'Air France Holidays.

## Adaptation Taxibrousse

Collections thématiques pour Taxibrousse:
- Routes saisonnières (été, hiver, fêtes)
- Catégories de service (VIP, Confort, Économique)
- Destinations thématiques (plage, montagne, ville)
- Offres spéciales (weekend, groupe, entreprise)

## Spécifications CMS

### Composant Principal
**Fichier**: `cms/src/components/page/featured-collections.json`

```json
{
  "collectionName": "components_page_featured_collections",
  "info": {
    "displayName": "Featured Collections",
    "description": "Collections thématiques mises en avant",
    "icon": "layer-group"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "subtitle": {
      "type": "text",
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "collections": {
      "type": "component",
      "repeatable": true,
      "required": true,
      "component": "page.collection-item"
    },
    "viewAllText": {
      "type": "string",
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "viewAllUrl": {
      "type": "string"
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

### Composant Collection Item
**Fichier**: `cms/src/components/page/collection-item.json`

```json
{
  "collectionName": "components_page_collection_items",
  "info": {
    "displayName": "Collection Item",
    "description": "Une collection thématique",
    "icon": "folder"
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "description": {
      "type": "text",
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "image": {
      "type": "media",
      "multiple": false,
      "required": true,
      "allowedTypes": ["images"]
    },
    "category": {
      "type": "string",
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "itemCount": {
      "type": "integer"
    },
    "link": {
      "type": "string",
      "required": true
    },
    "badge": {
      "type": "string",
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "badgeColor": {
      "type": "enumeration",
      "enum": ["primary", "secondary", "success", "warning", "error", "info"],
      "default": "primary"
    },
    "featured": {
      "type": "boolean",
      "default": false
    }
  }
}
```

## Spécifications Frontend

### Interface TypeScript
```typescript
export interface CollectionItem {
  id: number;
  name: string;
  description: string;
  image: StrapiMedia;
  category?: string;
  itemCount?: number;
  link: string;
  badge?: string;
  badgeColor: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  featured: boolean;
}

export interface FeaturedCollections {
  id: number;
  __component: 'page.featured-collections';
  title: string;
  subtitle?: string;
  collections: CollectionItem[];
  viewAllText?: string;
  viewAllUrl?: string;
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}
```

### Composant React
**Fichier**: `front/src/components/section/FeaturedCollections.tsx`

**Fonctionnalités**:
- Grille responsive avec cartes
- Images avec overlay au hover
- Badges pour nouveautés/promotions
- Compteur d'items dans collection
- Catégories affichées
- Featured items plus grands
- Navigation vers pages collection

## Exemple de Contenu

```json
{
  "title": "Nos Collections du Moment",
  "subtitle": "Découvrez nos sélections thématiques pour tous vos besoins de voyage",
  "viewAllText": "Voir toutes les collections",
  "viewAllUrl": "/collections",
  "backgroundColor": "#ffffff",
  "containerMaxWidth": "lg",
  "collections": [
    {
      "name": "Escapades Weekend",
      "description": "Profitez de nos offres spéciales pour vos sorties de fin de semaine",
      "category": "Loisirs",
      "itemCount": 12,
      "link": "/collections/weekend",
      "badge": "Nouveau",
      "badgeColor": "success",
      "featured": true,
      "image": {
        "url": "/uploads/weekend-collection.jpg"
      }
    },
    {
      "name": "Voyages d'Affaires",
      "description": "Solutions professionnelles pour vos déplacements entreprise",
      "category": "Business",
      "itemCount": 8,
      "link": "/collections/business",
      "featured": false,
      "image": {
        "url": "/uploads/business-collection.jpg"
      }
    },
    {
      "name": "Destinations Plage",
      "description": "Rejoignez les plus belles plages de Madagascar",
      "category": "Vacances",
      "itemCount": 15,
      "link": "/collections/plage",
      "badge": "Populaire",
      "badgeColor": "warning",
      "featured": false,
      "image": {
        "url": "/uploads/beach-collection.jpg"
      }
    },
    {
      "name": "Circuits Découverte",
      "description": "Explorez Madagascar avec nos circuits organisés",
      "category": "Tourisme",
      "itemCount": 10,
      "link": "/collections/circuits",
      "featured": false,
      "image": {
        "url": "/uploads/discovery-collection.jpg"
      }
    }
  ]
}
```

## Design Patterns

### Layout Standard
```
┌─────────────────┬──────────┬──────────┐
│                 │          │          │
│   Featured      │  Item 2  │  Item 3  │
│   (Large)       │          │          │
│                 ├──────────┼──────────┤
│                 │  Item 4  │  Item 5  │
└─────────────────┴──────────┴──────────┘
```

### Layout Uniforme
```
┌──────────┬──────────┬──────────┐
│  Item 1  │  Item 2  │  Item 3  │
│          │          │          │
├──────────┼──────────┼──────────┤
│  Item 4  │  Item 5  │  Item 6  │
│          │          │          │
└──────────┴──────────┴──────────┘
```

## Styling

### Cartes
- Border radius: 12px
- Overflow: hidden
- Box shadow: subtle
- Hover: elevation + scale(1.03)
- Transition: 0.3s ease

### Images
- Aspect ratio: 16:9 ou 4:3
- Object fit: cover
- Overlay gradient au hover
- Brightness: 0.9 au hover

### Badges
- Position: absolute top-right
- Padding: 4px 12px
- Border radius: 16px
- Font size: 0.75rem
- Font weight: bold

### Overlay Content
- Position: absolute bottom
- Background: linear-gradient
- Padding: 16px
- Color: white

## Responsive Breakpoints

- **xs (mobile)**: 1 colonne
- **sm (tablet)**: 2 colonnes
- **md (desktop)**: 3 colonnes
- **lg+ (large)**: 4 colonnes (si 8+ items)

## Meilleures Pratiques

1. **4-8 collections**: Nombre optimal pour la découverte
2. **Images cohérentes**: Même style photographique
3. **Descriptions courtes**: 1 phrase percutante
4. **Featured stratégique**: 1-2 collections mises en avant
5. **Badges pertinents**: Nouveau, Populaire, Promo uniquement
6. **Compteurs réels**: Afficher le vrai nombre d'items
7. **Catégories claires**: Faciliter la navigation
8. **Update régulier**: Rafraîchir les collections saisonnières

## Cas d'Usage

1. **Homepage**: Collections principales
2. **Page Destinations**: Collections par région
3. **Page Services**: Collections par type de service
4. **Landing pages**: Collections thématiques ciblées
5. **Page Promotions**: Collections en promotion

## Variantes

### Variante Carousel
- Défilement horizontal
- Navigation par flèches
- Dots indicators
- Auto-play optionnel

### Variante Masonry
- Hauteurs variables
- Layout Pinterest-style
- Plus dynamique visuellement

### Variante Minimale
- Pas d'images
- Icônes uniquement
- Focus sur le texte
- Chargement ultra-rapide

## Accessibilité

- [ ] Alt text pour toutes les images
- [ ] Contraste suffisant sur overlays
- [ ] Navigation clavier
- [ ] Focus indicators
- [ ] ARIA labels pour badges
- [ ] Semantic HTML

## Performance

- Lazy loading des images
- Image optimization (WebP)
- Skeleton loading
- Prefetch des liens au hover
- CSS Grid pour layout

## Testing Checklist

- [ ] Grille responsive
- [ ] Images chargent correctement
- [ ] Hover effects fluides
- [ ] Badges positionnés correctement
- [ ] Featured items mis en avant
- [ ] Liens fonctionnent
- [ ] Compteurs affichés
- [ ] View all button fonctionne
- [ ] Skeleton charge
- [ ] Internationalisation OK

## Intégration

Ajouter dans:
- `section.types.ts`: `FEATURED_COLLECTIONS: 'page.featured-collections'`
- `dynamic-page.api.ts`: Interfaces TypeScript
- `Section.tsx`: Mapping du composant
- `dynamic-page/schema.json`: Dans components array

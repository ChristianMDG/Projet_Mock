# Benefits Showcase Section

## Description

Section présentant les avantages clés du service sous forme de grille avec icônes, titres et descriptions. Inspirée de la section "Que des avantages" d'Air France Holidays.

## Adaptation Taxibrousse

Pour Taxibrousse, cette section met en avant:
- Programme de fidélité (points par trajet)
- Paiement flexible (échelonné, mobile money)
- Garantie de service
- Excellence du transport
- Support client 24/7

## Spécifications CMS

### Composant Principal
**Fichier**: `cms/src/components/page/benefits-showcase.json`

```json
{
  "collectionName": "components_page_benefits_showcases",
  "info": {
    "displayName": "Benefits Showcase",
    "description": "Présentation des avantages clés du service",
    "icon": "star"
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
    "benefits": {
      "type": "component",
      "repeatable": true,
      "required": true,
      "component": "page.benefit-item"
    },
    "layout": {
      "type": "enumeration",
      "enum": ["grid", "carousel", "list"],
      "default": "grid"
    },
    "backgroundColor": {
      "type": "string",
      "default": "#ffffff"
    },
    "containerMaxWidth": {
      "type": "enumeration",
      "enum": ["xs", "sm", "md", "lg", "xl"],
      "default": "lg"
    }
  }
}
```

### Composant Item
**Fichier**: `cms/src/components/page/benefit-item.json`

```json
{
  "collectionName": "components_page_benefit_items",
  "info": {
    "displayName": "Benefit Item",
    "description": "Un avantage individuel",
    "icon": "check-circle"
  },
  "attributes": {
    "icon": {
      "type": "string",
      "required": true,
      "default": "CheckCircle"
    },
    "title": {
      "type": "string",
      "required": true,
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "description": {
      "type": "text",
      "required": true,
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "link": {
      "type": "string"
    },
    "linkText": {
      "type": "string",
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "highlighted": {
      "type": "boolean",
      "default": false
    },
    "color": {
      "type": "enumeration",
      "enum": ["primary", "secondary", "success", "warning", "info"],
      "default": "primary"
    }
  }
}
```

## Spécifications Frontend

### Interface TypeScript
```typescript
export interface BenefitItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  highlighted: boolean;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}

export interface BenefitsShowcase {
  id: number;
  __component: 'page.benefits-showcase';
  title: string;
  subtitle?: string;
  benefits: BenefitItem[];
  layout: 'grid' | 'carousel' | 'list';
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}
```

### Composant React
**Fichier**: `front/src/components/section/BenefitsShowcase.tsx`

**Fonctionnalités**:
- Grille responsive (1-2-3-4 colonnes selon écran)
- Cartes avec icônes colorées
- Effet hover avec élévation
- Support des liens optionnels
- Mise en évidence des avantages clés
- Layout alternatif en carousel pour mobile

### Skeleton
**Fichier**: `front/src/components/section/skeleton/BenefitsShowcaseSkeleton.tsx`

## Exemple de Contenu

```json
{
  "title": "Que des avantages avec Taxibrousse",
  "subtitle": "Voyagez en toute sérénité avec nos services premium",
  "layout": "grid",
  "backgroundColor": "#f8f9fa",
  "containerMaxWidth": "lg",
  "benefits": [
    {
      "icon": "Stars",
      "title": "Programme de Fidélité",
      "description": "Gagnez des points à chaque trajet et bénéficiez de réductions exclusives",
      "highlighted": true,
      "color": "primary",
      "link": "/fidelite",
      "linkText": "En savoir plus"
    },
    {
      "icon": "Payment",
      "title": "Paiement Flexible",
      "description": "Payez en plusieurs fois ou utilisez Mobile Money pour plus de flexibilité",
      "highlighted": false,
      "color": "success"
    },
    {
      "icon": "VerifiedUser",
      "title": "Garantie Meilleur Prix",
      "description": "Nous vous remboursons la différence si vous trouvez moins cher ailleurs",
      "highlighted": true,
      "color": "warning"
    },
    {
      "icon": "EmojiEvents",
      "title": "Excellence du Service",
      "description": "Véhicules confortables, chauffeurs professionnels et ponctualité garantie",
      "highlighted": false,
      "color": "info"
    },
    {
      "icon": "SupportAgent",
      "title": "Support 24/7",
      "description": "Notre équipe est disponible à tout moment pour vous accompagner",
      "highlighted": false,
      "color": "secondary"
    },
    {
      "icon": "Security",
      "title": "Assurance Voyage",
      "description": "Voyagez l'esprit tranquille avec notre couverture complète",
      "highlighted": false,
      "color": "primary"
    }
  ]
}
```

## Design Patterns

### Layout Grid (Recommandé)
```
┌──────────┬──────────┬──────────┐
│ Benefit  │ Benefit  │ Benefit  │
│    1     │    2     │    3     │
├──────────┼──────────┼──────────┤
│ Benefit  │ Benefit  │ Benefit  │
│    4     │    5     │    6     │
└──────────┴──────────┴──────────┘
```

### Layout Carousel (Mobile)
```
┌────────────────────────────────┐
│  ◄  [  Benefit 1  ]  ►        │
│     ● ○ ○ ○ ○ ○               │
└────────────────────────────────┘
```

## Styling

### Cartes
- Padding: 24px
- Border radius: 8px
- Box shadow: elevation 2
- Hover: elevation 4 + scale(1.02)
- Transition: 0.3s ease

### Icônes
- Taille: 48px
- Couleur: Selon propriété color
- Background: Cercle avec couleur en alpha 0.1
- Margin bottom: 16px

### Typographie
- Titre: H6, bold
- Description: Body2, color text.secondary
- Link: Button text, underline on hover

## Responsive Breakpoints

- **xs (mobile)**: 1 colonne
- **sm (tablet)**: 2 colonnes
- **md (desktop)**: 3 colonnes
- **lg+ (large)**: 4 colonnes (si 6+ items)

## Icônes Recommandées

- `Stars` - Programme fidélité
- `Payment` - Paiement
- `VerifiedUser` - Garantie
- `EmojiEvents` - Excellence
- `SupportAgent` - Support
- `Security` - Assurance
- `LocalOffer` - Promotions
- `Speed` - Rapidité
- `Eco` - Écologique
- `Groups` - Communauté

## Meilleures Pratiques

1. **Limiter à 4-8 avantages**: Trop d'options créent de la confusion
2. **Hiérarchiser**: Mettre en avant 2-3 avantages clés avec `highlighted`
3. **Icônes cohérentes**: Utiliser un style uniforme
4. **Descriptions concises**: 1-2 phrases maximum
5. **Call-to-action**: Ajouter des liens pour les avantages complexes
6. **Couleurs significatives**: Utiliser les couleurs de manière cohérente
7. **Mobile first**: Tester le carousel sur mobile
8. **Accessibilité**: Alt text pour icônes, contraste suffisant

## Cas d'Usage

1. **Homepage**: Présenter les avantages principaux
2. **Page À propos**: Détailler la proposition de valeur
3. **Page Tarifs**: Justifier les prix avec les avantages
4. **Landing pages**: Convertir les visiteurs
5. **Page Inscription**: Encourager la création de compte

## Variantes

### Variante Compacte
- Layout: list
- Icônes plus petites (32px)
- Pas de cartes, juste icône + texte
- Idéal pour footer ou sidebar

### Variante Premium
- Background gradient
- Icônes animées
- Cartes avec bordure colorée
- Effet parallax au scroll

### Variante Minimaliste
- Pas de cartes
- Icônes monochromes
- Typographie épurée
- Espacement généreux

## Accessibilité

- [ ] Icônes avec aria-label
- [ ] Contraste texte/fond ≥ 4.5:1
- [ ] Navigation clavier (carousel)
- [ ] Focus visible
- [ ] Screen reader friendly
- [ ] Semantic HTML (section, article)

## Performance

- Lazy load des icônes
- CSS Grid pour layout
- Pas d'images lourdes
- Animations GPU-accelerated
- Memoization du composant

## Testing Checklist

- [ ] Affichage correct desktop
- [ ] Affichage correct tablet
- [ ] Affichage correct mobile
- [ ] Carousel fonctionne (si activé)
- [ ] Liens fonctionnent
- [ ] Hover effects fluides
- [ ] Highlighted items visibles
- [ ] Couleurs appliquées correctement
- [ ] Skeleton charge correctement
- [ ] Internationalisation OK
- [ ] Accessible au clavier
- [ ] Compatible screen readers

## Intégration

Ajouter dans:
- `section.types.ts`: `BENEFITS_SHOWCASE: 'page.benefits-showcase'`
- `dynamic-page.api.ts`: Interfaces TypeScript
- `Section.tsx`: Mapping du composant
- `dynamic-page/schema.json`: Dans components array

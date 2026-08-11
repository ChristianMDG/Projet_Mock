# Trust Indicators Section

## Description

Section présentant les garanties, certifications et éléments de réassurance pour établir la confiance avec les clients. Inspirée des garanties Air France Holidays (meilleur prix, solutions de remplacement, support expert).

## Adaptation Taxibrousse

Indicateurs de confiance pour Taxibrousse:
- Garantie de sécurité
- Assurance voyage incluse
- Support client réactif
- Véhicules certifiés
- Chauffeurs professionnels
- Remboursement garanti

## Spécifications CMS

### Composant Principal
**Fichier**: `cms/src/components/page/trust-indicators.json`

```json
{
  "collectionName": "components_page_trust_indicators",
  "info": {
    "displayName": "Trust Indicators",
    "description": "Indicateurs de confiance et garanties",
    "icon": "shield-check"
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
    "indicators": {
      "type": "component",
      "repeatable": true,
      "required": true,
      "component": "page.trust-indicator-item"
    },
    "layout": {
      "type": "enumeration",
      "enum": ["horizontal", "vertical", "grid"],
      "default": "horizontal"
    },
    "showBorder": {
      "type": "boolean",
      "default": true
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

### Composant Trust Indicator Item
**Fichier**: `cms/src/components/page/trust-indicator-item.json`

```json
{
  "collectionName": "components_page_trust_indicator_items",
  "info": {
    "displayName": "Trust Indicator Item",
    "description": "Un indicateur de confiance",
    "icon": "check-shield"
  },
  "attributes": {
    "icon": {
      "type": "string",
      "required": true,
      "default": "VerifiedUser"
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
    }
  }
}
```

## Spécifications Frontend

### Interface TypeScript
```typescript
export interface TrustIndicatorItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}

export interface TrustIndicators {
  id: number;
  __component: 'page.trust-indicators';
  title: string;
  subtitle?: string;
  indicators: TrustIndicatorItem[];
  layout: 'horizontal' | 'vertical' | 'grid';
  showBorder: boolean;
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}
```

### Composant React
**Fichier**: `front/src/components/section/TrustIndicators.tsx`

**Fonctionnalités**:
- Layout flexible (horizontal/vertical/grid)
- Icônes de confiance
- Liens optionnels vers détails
- Bordures optionnelles
- Design minimaliste et professionnel

## Exemple de Contenu

```json
{
  "title": "Voyagez en Toute Confiance",
  "subtitle": "Votre sécurité et satisfaction sont nos priorités",
  "layout": "horizontal",
  "showBorder": true,
  "backgroundColor": "#f8f9fa",
  "containerMaxWidth": "lg",
  "indicators": [
    {
      "icon": "VerifiedUser",
      "title": "Garantie Sécurité",
      "description": "Tous nos véhicules sont contrôlés et certifiés conformes aux normes de sécurité",
      "link": "/securite",
      "linkText": "En savoir plus"
    },
    {
      "icon": "Support",
      "title": "Support 24/7",
      "description": "Notre équipe est disponible à tout moment pour vous assister",
      "link": "/contact",
      "linkText": "Nous contacter"
    },
    {
      "icon": "MoneyBack",
      "title": "Remboursement Garanti",
      "description": "Annulation gratuite jusqu'à 24h avant le départ",
      "link": "/conditions",
      "linkText": "Voir conditions"
    },
    {
      "icon": "Certificate",
      "title": "Chauffeurs Certifiés",
      "description": "Tous nos chauffeurs sont formés et possèdent les licences requises"
    }
  ]
}
```

## Design Patterns

### Layout Horizontal
```
┌────────────────────────────────────────────────────┐
│  [Icon] Titre 1    [Icon] Titre 2    [Icon] Titre 3│
│  Description       Description       Description    │
└────────────────────────────────────────────────────┘
```

### Layout Grid
```
┌──────────────┬──────────────┐
│  [Icon]      │  [Icon]      │
│  Titre 1     │  Titre 2     │
│  Description │  Description │
├──────────────┼──────────────┤
│  [Icon]      │  [Icon]      │
│  Titre 3     │  Titre 4     │
│  Description │  Description │
└──────────────┴──────────────┘
```

## Styling

### Horizontal Layout
- Flexbox row
- Equal width items
- Dividers entre items
- Compact spacing

### Grid Layout
- CSS Grid 2-4 colonnes
- Cards avec padding
- Box shadow subtle
- Plus d'espace

### Icônes
- Taille: 40px
- Couleur: primary ou success
- Margin bottom: 12px

## Meilleures Pratiques

1. **3-5 indicateurs**: Pas trop pour rester crédible
2. **Icônes cohérentes**: Style uniforme
3. **Preuves concrètes**: Chiffres, certifications
4. **Liens vers détails**: Pour transparence
5. **Placement stratégique**: Près des CTAs
6. **Mobile friendly**: Layout adaptatif
7. **Mise à jour**: Garder les infos actuelles

## Cas d'Usage

1. **Homepage**: Au-dessus du footer
2. **Page réservation**: Avant paiement
3. **Landing pages**: Rassurer visiteurs
4. **Page tarifs**: Justifier les prix
5. **Checkout**: Finaliser la confiance

## Icônes Recommandées

- `VerifiedUser` - Certification
- `Security` - Sécurité
- `Support` - Support client
- `MoneyBack` - Remboursement
- `Certificate` - Certification
- `Shield` - Protection
- `ThumbUp` - Satisfaction
- `Stars` - Qualité

## Accessibilité

- [ ] Icônes avec aria-label
- [ ] Contraste suffisant
- [ ] Liens identifiables
- [ ] Navigation clavier
- [ ] Semantic HTML

## Testing Checklist

- [ ] Layout correct sur tous écrans
- [ ] Icônes affichées
- [ ] Liens fonctionnent
- [ ] Bordures si activées
- [ ] Responsive
- [ ] Accessible

## Intégration

Ajouter dans:
- `section.types.ts`: `TRUST_INDICATORS: 'page.trust-indicators'`
- `dynamic-page.api.ts`: Interfaces
- `Section.tsx`: Mapping
- `dynamic-page/schema.json`: Components array

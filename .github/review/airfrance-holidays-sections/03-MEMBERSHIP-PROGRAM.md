# Membership Program Section

## Description

Section dédiée au programme de fidélité avec présentation des avantages membres, système de points/crédits et incitation à l'inscription. Inspirée de "Devenez membre Air France holidays".

## Adaptation Taxibrousse

Programme de fidélité Taxibrousse:
- Système de points par trajet
- Niveaux de membership (Bronze, Silver, Gold, Platinum)
- Avantages exclusifs par niveau
- Ventes privilèges
- Newsletter et offres personnalisées

## Spécifications CMS

### Composant Principal
**Fichier**: `cms/src/components/page/membership-program.json`

```json
{
  "collectionName": "components_page_membership_programs",
  "info": {
    "displayName": "Membership Program",
    "description": "Programme de fidélité et avantages membres",
    "icon": "id-card"
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
    "programName": {
      "type": "string",
      "required": true,
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "description": {
      "type": "richtext",
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "benefits": {
      "type": "component",
      "repeatable": true,
      "required": true,
      "component": "page.membership-benefit"
    },
    "ctaText": {
      "type": "string",
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "ctaUrl": {
      "type": "string"
    },
    "secondaryCtaText": {
      "type": "string",
      "pluginOptions": { "i18n": { "localized": true } }
    },
    "secondaryCtaUrl": {
      "type": "string"
    },
    "backgroundColor": {
      "type": "string",
      "default": "#f0f7ff"
    },
    "containerMaxWidth": {
      "type": "enumeration",
      "enum": ["xs", "sm", "md", "lg", "xl"],
      "default": "lg"
    }
  }
}
```

### Composant Membership Benefit
**Fichier**: `cms/src/components/page/membership-benefit.json`

```json
{
  "collectionName": "components_page_membership_benefits",
  "info": {
    "displayName": "Membership Benefit",
    "description": "Avantage du programme de fidélité",
    "icon": "gift"
  },
  "attributes": {
    "icon": {
      "type": "string",
      "required": true,
      "default": "CardGiftcard"
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
    "value": {
      "type": "string",
      "pluginOptions": { "i18n": { "localized": true } }
    }
  }
}
```

## Spécifications Frontend

### Interface TypeScript
```typescript
export interface MembershipBenefit {
  id: number;
  icon: string;
  title: string;
  description: string;
  value?: string;
}

export interface MembershipProgram {
  id: number;
  __component: 'page.membership-program';
  title: string;
  subtitle?: string;
  programName: string;
  description?: string;
  benefits: MembershipBenefit[];
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}
```

### Composant React
**Fichier**: `front/src/components/section/MembershipProgram.tsx`

**Fonctionnalités**:
- Hero section avec titre accrocheur
- Grille de bénéfices avec icônes
- Valeurs quantifiables (ex: "Jusqu'à 20% de réduction")
- Double CTA (inscription + en savoir plus)
- Design premium avec dégradés
- Animation au scroll

## Exemple de Contenu

```json
{
  "title": "Rejoignez le Club Taxibrousse",
  "subtitle": "Profitez d'avantages exclusifs à chaque voyage",
  "programName": "Club Taxibrousse Premium",
  "description": "<p>Voyagez plus, économisez plus ! Notre programme de fidélité récompense votre confiance avec des avantages exceptionnels.</p>",
  "ctaText": "Devenir membre gratuitement",
  "ctaUrl": "/inscription",
  "secondaryCtaText": "Découvrir le programme",
  "secondaryCtaUrl": "/fidelite",
  "backgroundColor": "#f0f7ff",
  "containerMaxWidth": "lg",
  "benefits": [
    {
      "icon": "Savings",
      "title": "Collectez des Points",
      "description": "Gagnez 10 points par Ariary dépensé sur tous vos trajets",
      "value": "10 pts/Ar"
    },
    {
      "icon": "Discount",
      "title": "Réductions Exclusives",
      "description": "Bénéficiez jusqu'à 20% de réduction sur vos réservations",
      "value": "Jusqu'à -20%"
    },
    {
      "icon": "LocalOffer",
      "title": "Ventes Privilèges",
      "description": "Accédez en avant-première à nos promotions et offres spéciales",
      "value": "Accès VIP"
    },
    {
      "icon": "Email",
      "title": "Newsletter Personnalisée",
      "description": "Recevez chaque semaine des offres adaptées à vos destinations préférées",
      "value": "Hebdomadaire"
    },
    {
      "icon": "CardGiftcard",
      "title": "Cadeaux d'Anniversaire",
      "description": "Un voyage offert pour votre anniversaire après 10 trajets",
      "value": "1 trajet gratuit"
    },
    {
      "icon": "PriorityHigh",
      "title": "Service Prioritaire",
      "description": "File d'attente prioritaire et support client dédié 24/7",
      "value": "Support VIP"
    }
  ]
}
```

## Design Patterns

### Layout Hero + Grid
```
┌─────────────────────────────────────┐
│         TITRE PROGRAMME             │
│         Sous-titre                  │
│    [CTA Principal] [CTA Second]     │
├──────────┬──────────┬──────────────┤
│ Benefit  │ Benefit  │   Benefit    │
│    1     │    2     │      3       │
├──────────┼──────────┼──────────────┤
│ Benefit  │ Benefit  │   Benefit    │
│    4     │    5     │      6       │
└──────────┴──────────┴──────────────┘
```

### Layout Split
```
┌──────────────────┬──────────────────┐
│                  │  • Benefit 1     │
│   PROGRAMME      │  • Benefit 2     │
│   DESCRIPTION    │  • Benefit 3     │
│                  │  • Benefit 4     │
│   [CTA]          │  • Benefit 5     │
└──────────────────┴──────────────────┘
```

## Styling

### Hero Section
- Background: Gradient ou couleur unie
- Padding: 48px vertical
- Text align: center
- Max width: 800px pour le texte

### Benefit Cards
- Background: white avec légère ombre
- Border radius: 16px
- Padding: 24px
- Icon size: 56px
- Icon background: Cercle coloré alpha 0.1

### CTAs
- Primary: Contained button, large
- Secondary: Outlined button, large
- Spacing: 16px entre les boutons
- Min width: 200px

### Values Display
- Font size: 1.25rem
- Font weight: bold
- Color: primary
- Badge style optionnel

## Responsive Breakpoints

- **xs (mobile)**: 1 colonne, CTAs stacked
- **sm (tablet)**: 2 colonnes
- **md (desktop)**: 3 colonnes
- **lg+ (large)**: 3 colonnes avec plus d'espace

## Meilleures Pratiques

1. **Valeur claire**: Quantifier les avantages (%, points, €)
2. **CTA visible**: Bouton d'inscription bien mis en avant
3. **Gratuit souligné**: Mentionner si l'adhésion est gratuite
4. **Preuves sociales**: Ajouter nombre de membres
5. **Simplicité**: 4-6 avantages principaux
6. **Urgence**: "Offre limitée" si applicable
7. **Transparence**: Lien vers conditions complètes
8. **Mobile optimized**: CTAs facilement cliquables

## Cas d'Usage

1. **Homepage**: Section dédiée au programme
2. **Page Fidélité**: Page complète du programme
3. **Après réservation**: Incitation à rejoindre
4. **Email marketing**: Campagnes d'acquisition
5. **Landing pages**: Conversion membres

## Variantes

### Variante Tiers
Afficher les différents niveaux de membership:
- Bronze (gratuit)
- Silver (10 trajets)
- Gold (25 trajets)
- Platinum (50 trajets)

### Variante Testimonial
Inclure témoignages de membres satisfaits

### Variante Calculator
Calculateur de points/économies potentielles

## Accessibilité

- [ ] Contraste texte/fond suffisant
- [ ] CTAs clairement identifiables
- [ ] Navigation clavier
- [ ] Focus indicators
- [ ] ARIA labels pour icônes
- [ ] Semantic HTML

## Performance

- Icônes SVG inline
- Pas d'images lourdes
- CSS Grid/Flexbox
- Animations CSS uniquement
- Lazy load si images présentes

## Testing Checklist

- [ ] Hero section affichée correctement
- [ ] Benefits en grille responsive
- [ ] Icônes chargent
- [ ] Valeurs affichées
- [ ] CTAs fonctionnent
- [ ] Hover effects
- [ ] Mobile layout correct
- [ ] Skeleton charge
- [ ] Internationalisation OK
- [ ] Accessible

## Intégration

Ajouter dans:
- `section.types.ts`: `MEMBERSHIP_PROGRAM: 'page.membership-program'`
- `dynamic-page.api.ts`: Interfaces TypeScript
- `Section.tsx`: Mapping du composant
- `dynamic-page/schema.json`: Dans components array

## Métriques de Succès

- Taux de clics sur CTA inscription
- Taux de conversion visiteur → membre
- Engagement avec le contenu
- Temps passé sur la section
- Scroll depth

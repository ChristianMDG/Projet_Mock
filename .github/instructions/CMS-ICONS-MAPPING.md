# CMS Icons Mapping Reference

## Overview

This document maps the icons used in the new dynamic sections to the available icons in the CMS (`cms/icons.json`).

## Icon Mappings Applied

### Benefits Showcase Section

| Original Icon | CMS Icon | Usage |
|--------------|----------|-------|
| Stars | `star` | Programme de Fidélité |
| Payment | `priceTag` | Paiement Flexible |
| VerifiedUser | `shield` | Garantie Meilleur Prix |
| EmojiEvents | `crown` | Excellence du Service |
| SupportAgent | `headphone` | Support 24/7 |
| Security | `lock` | Assurance Voyage |

### Trust Indicators Section

| Original Icon | CMS Icon | Usage |
|--------------|----------|-------|
| VerifiedUser | `shield` | Garantie Sécurité |
| Support | `headphone` | Support 24/7 |
| MoneyOff | `priceTag` | Remboursement Garanti |
| CardMembership | `user` | Chauffeurs Certifiés |

### Accident Instructions Section

| Original Icon | CMS Icon | Usage |
|--------------|----------|-------|
| LocalHospital | `shield` | Sécuriser la zone |
| Phone | `phone` | Appeler les secours |
| Healing | `handHeart` | Vérifier les blessés |
| Description | `picture` | Documenter l'accident |
| People | `discuss` | Échanger les informations |
| Assignment | `write` | Remplir le constat |
| ContactPhone | `envelop` | Contacter votre compagnie |
| MedicalServices | `doctor` | Consulter un médecin |

## Available CMS Icons

The complete list of available icons is defined in `cms/icons.json`:

### Categories

**Communication & Contact**
- `bell`, `discuss`, `envelop`, `headphone`, `message`, `microphone`, `phone`, `paperPlane`

**User & People**
- `user`, `doctor`, `emotionHappy`, `emotionUnhappy`

**Security & Safety**
- `shield`, `lock`, `key`

**Business & Commerce**
- `briefcase`, `priceTag`, `shoppingCart`, `store`, `restaurant`

**Media & Files**
- `file`, `fileError`, `filePdf`, `folder`, `picture`, `music`, `television`

**Navigation & UI**
- `arrowDown`, `arrowLeft`, `arrowRight`, `arrowUp`, `apps`, `dashboard`, `grid`, `layout`, `menu`

**Actions**
- `check`, `plus`, `search`, `refresh`, `rotate`, `write`, `pencil`, `scissors`

**Objects & Symbols**
- `star`, `crown`, `heart`, `gift`, `cup`, `handHeart`

**Technology**
- `cloud`, `code`, `cog`, `database`, `monitor`, `server`

**Travel & Transport**
- `car`, `plane`, `train`, `walk`, `wheelchair`, `earth`, `globe`, `pinMap`

**Time & Calendar**
- `clock`, `calendar`

**Weather & Nature**
- `sun`, `moon`, `typhoon`, `feather`, `seed`

**Other**
- `alien`, `archive`, `attachment`, `book`, `brush`, `cast`, `chartBubble`, `chartCircle`, `chartPie`, `collapse`, `command`, `connector`, `crop`, `cursor`, `exit`, `expand`, `eye`, `filter`, `gate`, `hashtag`, `house`, `information`, `landscape`, `layer`, `lightbulb`, `link`, `magic`, `manyToMany`, `manyToOne`, `manyWays`, `medium`, `oneToMany`, `oneToOne`, `oneWay`, `paint`, `paintBrush`, `pin`, `play`, `puzzle`, `question`, `quote`, `rocket`, `shirt`, `slideshow`, `stack`, `strikeThrough`, `thumbDown`, `thumbUp`, `twitter`, `underline`, `volumeMute`, `volumeUp`

## Usage Guidelines

### In Mutation Files

When creating or updating mutation files, use icons from the CMS list:

```json
{
  "icon": "star",
  "title": "Programme de Fidélité",
  "description": "..."
}
```

### In Strapi Admin

When adding content through the Strapi admin panel:
1. The icon field is a text input
2. Enter the icon name exactly as shown in `cms/icons.json`
3. Icons are case-sensitive (use lowercase)
4. No prefix needed (just `star`, not `icon-star`)

### Icon Selection Tips

Choose icons that best represent the content:

**For Security/Safety**: `shield`, `lock`, `key`  
**For Support/Help**: `headphone`, `message`, `phone`  
**For Users/People**: `user`, `doctor`, `discuss`  
**For Benefits/Features**: `star`, `crown`, `gift`, `heart`  
**For Payment/Money**: `priceTag`, `shoppingCart`  
**For Travel**: `car`, `plane`, `train`, `pinMap`  
**For Documents**: `file`, `write`, `pencil`  
**For Actions**: `check`, `plus`, `search`

## Frontend Icon Rendering

The frontend uses the `Icon` component from `@/shared/IconMapper` which maps these icon names to Material-UI icons:

```tsx
<Icon iconName="star" />
```

The IconMapper handles the conversion from CMS icon names to actual icon components.

## Validation

To ensure icons are valid:

1. **Check cms/icons.json**: Verify the icon exists in the list
2. **Test in Strapi**: Add content and verify no errors
3. **Check Frontend**: Ensure icons render correctly
4. **Browser Console**: Look for icon-related warnings

## Common Issues

### Icon Not Displaying
- **Cause**: Icon name not in `cms/icons.json`
- **Solution**: Choose a valid icon from the list

### Wrong Icon Showing
- **Cause**: Case sensitivity or typo
- **Solution**: Use exact lowercase name from list

### Icon Missing in Strapi
- **Cause**: Component schema not updated
- **Solution**: Rebuild CMS container

## Updates

When adding new icons:

1. Update `cms/icons.json`
2. Update `front/src/shared/IconMapper.tsx` mapping
3. Rebuild CMS: `docker compose -f docker-compose.local.yml build cms`
4. Update this documentation

## Related Files

- `cms/icons.json` - Master icon list
- `cms/custom-labels-config.json` - Icon labels for Strapi UI
- `front/src/shared/IconMapper.tsx` - Frontend icon mapping
- `cms/content/*.mutation.json` - Sample content with icons

## Icon Mapping Strategy

The mapping strategy prioritizes:
1. **Semantic accuracy**: Icon meaning matches content
2. **Visual clarity**: Icon is recognizable and clear
3. **Consistency**: Similar concepts use similar icons
4. **Availability**: Icon exists in CMS list

---

**Last Updated**: March 1, 2026  
**CMS Version**: 5.34.0  
**Total Available Icons**: 130

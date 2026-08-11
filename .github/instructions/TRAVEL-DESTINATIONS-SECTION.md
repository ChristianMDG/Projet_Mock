# Travel Destinations Section

## Overview

The Travel Destinations section displays a visually appealing grid of travel destinations with images, similar to airline destination showcases. Each destination features a large image with overlay text showing the city and country, creating an immersive browsing experience.

## Features

- **Flexible grid layout**: Mix of large, medium, and small cards
- **Image overlays**: City and country names displayed over destination images
- **Gradient overlays**: Dark gradient for text readability
- **Hover effects**: Subtle scale animation on hover
- **Clickable cards**: Optional links to destination pages
- **Call-to-action button**: Optional button to explore all destinations
- **Responsive design**: Adapts beautifully to all screen sizes
- **Customizable styling**: Background color and container width options

## CMS Components

### Main Component
**File**: `cms/src/components/page/travel-destinations.json`

```json
{
  "title": "string (required, localized)",
  "subtitle": "text (optional, localized)",
  "destinations": "component[] (required)",
  "buttonText": "string (optional, localized)",
  "buttonUrl": "string (optional)",
  "backgroundColor": "string (default: #f5f5f5)",
  "containerMaxWidth": "enum (xs|sm|md|lg|xl, default: xl)"
}
```

### Destination Item Component
**File**: `cms/src/components/page/travel-destination-item.json`

```json
{
  "city": "string (required, localized)",
  "country": "string (required, localized)",
  "image": "media (required, images only)",
  "description": "text (optional, localized)",
  "link": "string (optional)",
  "gridSize": "enum (small|medium|large, default: medium)",
  "order": "integer (default: 0)"
}
```

## Frontend Implementation

### Component
**File**: `front/src/components/section/TravelDestinations.tsx`

**Props**:
```typescript
interface TravelDestinationsProps {
  section: TravelDestinations;
}
```

**Features**:
- Automatic sorting by order field
- Dynamic grid sizing based on gridSize property
- Responsive card heights (large: 500px, medium: 350px, small: 300px)
- Image overlay with gradient background
- Hover scale effect for clickable cards
- Optional CTA button at the bottom

### Skeleton
**File**: `front/src/components/section/skeleton/TravelDestinationsSkeleton.tsx`

Displays loading state with mixed grid sizes matching typical layout.

## Grid Sizes

| Size | Desktop (md+) | Tablet (sm) | Mobile (xs) | Height |
|------|---------------|-------------|-------------|--------|
| `large` | 8/12 (66%) | 12/12 (100%) | 12/12 (100%) | 500px |
| `medium` | 6/12 (50%) | 6/12 (50%) | 12/12 (100%) | 350px |
| `small` | 4/12 (33%) | 6/12 (50%) | 12/12 (100%) | 300px |

## Layout Patterns

### Air France Style (Recommended)
```
┌─────────────────────┬──────────┐
│                     │          │
│      Large          │  Medium  │
│     (Munich)        │ (Houston)│
│                     │          │
├──────────┬──────────┴──────────┤
│  Small   │        Small        │
│ (Turin)  │     (Amsterdam)     │
└──────────┴─────────────────────┘
```

Order: 1 (large), 2 (medium), 3 (small), 4 (small)

### Balanced Grid
```
┌──────────┬──────────┬──────────┐
│  Medium  │  Medium  │  Medium  │
│          │          │          │
├──────────┴──────────┴──────────┤
│  Medium  │  Medium  │  Medium  │
│          │          │          │
└──────────┴──────────┴──────────┘
```

All destinations with gridSize: "medium"

### Hero + Gallery
```
┌─────────────────────────────────┐
│                                 │
│           Large                 │
│         (Featured)              │
│                                 │
├──────────┬──────────┬──────────┤
│  Small   │  Small   │  Small   │
└──────────┴──────────┴──────────┘
```

Order: 1 (large), 2-4 (small)

## Image Requirements

### Dimensions
- **Large cards**: 1200x800px minimum (3:2 ratio)
- **Medium cards**: 800x600px minimum (4:3 ratio)
- **Small cards**: 600x450px minimum (4:3 ratio)

### Format
- JPEG or WebP for photos
- PNG for graphics with transparency
- Max file size: 500KB (optimize for web)

### Content
- High-quality destination photos
- Clear focal point
- Good contrast for text overlay
- Avoid busy backgrounds at bottom (where text appears)

## Usage in Strapi

1. Navigate to Content Manager → Dynamic Pages
2. Create or edit a page
3. Add "Travel Destinations" section
4. Fill in:
   - Title (e.g., "Air France Destination-voyage")
   - Subtitle (e.g., "Tous vos rêves ont une destination")
   - Background Color (optional, default: #f5f5f5)
   - Container Max Width (optional, default: xl)
   - Button Text (optional, e.g., "Explorez nos destinations")
   - Button URL (optional, e.g., "/destinations")
5. Add destination items:
   - Upload high-quality image
   - Enter city name
   - Enter country name
   - Add description (optional, 1-2 sentences)
   - Set grid size (large/medium/small)
   - Set order number (1, 2, 3...)
   - Add link (optional)
6. Save and publish

## Sample Content

See `cms/content/travel-destinations.mutation.json` for a complete Air France-style example with:
- Munich (large) - Featured destination
- Houston (medium) - Secondary highlight
- Turin (small) - Gallery item
- Amsterdam (small) - Gallery item

## Styling

### Default Colors
- Background: `#f5f5f5` (light gray)
- Overlay gradient: `rgba(0,0,0,0.8)` to `transparent`
- Text: White on dark overlay

### Typography
- Country: Caption, uppercase, letter-spacing: 1px
- City: H5, bold
- Description: Body2, 2-line clamp

### Effects
- Hover scale: 1.02 (2% zoom)
- Transition: 0.3s ease-in-out
- Border radius: Default Material UI

## Internationalization

All text fields support i18n:
- `title` - Section title
- `subtitle` - Section subtitle
- `destinations[].city` - City name
- `destinations[].country` - Country name
- `destinations[].description` - Destination description
- `buttonText` - CTA button text

Image and link fields are not localized.

## Best Practices

1. **Mix grid sizes**: Use variety for visual interest (1 large + 2-3 small works well)
2. **Limit destinations**: 4-8 destinations per section for optimal impact
3. **High-quality images**: Use professional travel photography
4. **Consistent style**: Keep image style consistent (all daytime, all aerial, etc.)
5. **Order strategically**: Put most attractive destination first (large card)
6. **Short descriptions**: Keep to 1-2 sentences, let images speak
7. **Test on mobile**: Ensure text is readable on small screens
8. **Optimize images**: Compress images without losing quality
9. **Use links wisely**: Link to detailed destination pages or booking
10. **Update seasonally**: Refresh destinations based on seasons/promotions

## Accessibility

- Alt text for all images (automatically from Strapi media)
- Sufficient contrast for overlay text (dark gradient ensures readability)
- Keyboard navigation support for clickable cards
- Screen reader friendly structure
- Semantic HTML (Card, Typography components)
- Focus indicators on interactive elements

## Performance

- Lazy loading for images (handled by browser)
- Optimized image sizes from Strapi
- CSS transforms for hover effects (GPU accelerated)
- Minimal re-renders with React.memo potential

## Integration

The section is automatically registered in:
- `front/src/constants/section.types.ts` as `TRAVEL_DESTINATIONS`
- `front/src/components/section/Section.tsx` component mapping
- `front/src/api/dynamic-page.api.ts` TypeScript types
- `cms/src/api/dynamic-page/content-types/dynamic-page/schema.json` dynamic zone

## Related Sections

- **Destinations Grid**: Alternative grid layout with more structure
- **Popular Destinations**: Destination cards with pricing and details
- **Popular Routes**: Route-based destination display
- **Promotional Content**: Promotional destination offers

## Use Cases

1. **Homepage hero**: Feature top destinations
2. **Destinations page**: Showcase all available destinations
3. **Seasonal campaigns**: Highlight summer/winter destinations
4. **Regional focus**: Group destinations by region
5. **Partnership pages**: Show partner airline destinations
6. **Landing pages**: Targeted destination marketing

## Testing Checklist

- [ ] Section displays correctly on desktop
- [ ] Section displays correctly on tablet
- [ ] Section displays correctly on mobile
- [ ] Images load and display properly
- [ ] Text overlay is readable on all images
- [ ] Hover effects work smoothly
- [ ] Clickable cards navigate correctly
- [ ] CTA button displays and works
- [ ] Grid layout adapts responsively
- [ ] Skeleton loads during data fetch
- [ ] Internationalization works
- [ ] Images are optimized
- [ ] Accessible with keyboard
- [ ] Screen reader compatible

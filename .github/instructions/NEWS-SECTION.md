# News Section - Dynamic Component

## Overview
The News Section is a dynamic component that displays news articles and updates in a card-based grid layout. It's designed to showcase company news, announcements, promotions, and other timely content.

## Component Structure

### CMS Components
- `cms/src/components/page/news-item.json` - Individual news article schema
- `cms/src/components/page/news-section.json` - News section container schema

### Frontend Components
- `front/src/components/section/NewsSection.tsx` - Main React component
- `front/src/components/section/skeleton/NewsSectionSkeleton.tsx` - Loading skeleton

### Types & Constants
- `front/src/api/dynamic-page.api.ts` - TypeScript interfaces (NewsItem, NewsSection)
- `front/src/constants/section.types.ts` - SECTION_TYPES.NEWS_SECTION constant

## Features

### Visual Design
- Card-based grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
- Image support for each news item
- Category chips for content classification
- Hover effects with elevation and transform
- Responsive image handling

### Content Structure
Each news item includes:
- **Title**: Main headline (required, max 200 chars)
- **Description**: Article summary (required, text field)
- **Image**: Optional featured image
- **Category**: Content classification (required, localized)
- **Link**: Optional external or internal URL
- **Button Text**: Customizable CTA text (defaults to "Read More")

### Section Configuration
- **Title**: Section heading (required, default: "Actualités")
- **Subtitle**: Optional section description
- **Background Color**: Customizable background
- **Container Max Width**: xs, sm, md, lg, xl (default: lg)

## Usage in Strapi

### Creating a News Section
1. Navigate to Dynamic Pages in Strapi
2. Add a "News Section" component to the sections zone
3. Configure the section title and subtitle
4. Add news items with:
   - Compelling titles
   - Brief descriptions (2-3 sentences)
   - Relevant category labels
   - Optional images (recommended: 16:9 aspect ratio, min 800x450px)
   - Links to full articles or landing pages

### Best Practices
- Use high-quality images with consistent aspect ratios
- Keep descriptions concise (under 150 characters)
- Use clear, action-oriented button text
- Organize content with meaningful categories
- Limit to 3-6 news items per section for optimal display
- Update regularly to keep content fresh

## Translation Support
The component supports i18n for:
- Section title and subtitle
- News item titles and descriptions
- Category labels
- Button text

Default translations:
- English: "Read More"
- French: "En savoir plus"
- Malagasy: "Hamaky bebe kokoa"

## Example Content

```json
{
  "title": "Actualités",
  "subtitle": "Nos dernières nouvelles et mises à jour",
  "newsItems": [
    {
      "title": "Las Vegas en vol direct",
      "description": "Envolez-vous vers le Nevada dès avril 2026. Réservez sans attendre !",
      "category": "Nouvelle destination",
      "link": "/destinations/las-vegas",
      "buttonText": "En savoir plus"
    }
  ],
  "backgroundColor": "background.default",
  "containerMaxWidth": "lg"
}
```

## Technical Details

### Component Props
```typescript
interface NewsSectionProps {
  section: NewsSection;
  sx?: SxProps<Theme>;
}
```

### Data Structure
```typescript
interface NewsItem {
  id: number;
  title: string;
  description: string;
  image?: StrapiMedia;
  category: string;
  link?: string;
  buttonText?: string;
}

interface NewsSection {
  id: number;
  __component: 'page.news-section';
  title: string;
  subtitle?: string;
  newsItems: NewsItem[];
  backgroundColor?: string;
  containerMaxWidth?: ContainerMaxWidth;
}
```

### Styling
- Uses Material-UI Grid v2 with responsive sizing
- Card hover effects: translateY(-4px) and elevated shadow
- Image height: 200px with object-fit: cover
- Consistent spacing: py: 6 for section, spacing: 4 for grid

## Integration

### Adding to Dynamic Pages
The News Section is automatically available in the Dynamic Page sections zone after deployment. It's registered in:
- `cms/src/api/dynamic-page/content-types/dynamic-page/schema.json`
- `front/src/components/section/Section.tsx`

### Section Type Constant
```typescript
SECTION_TYPES.NEWS_SECTION = 'page.news-section'
```

### Category Classification
Included in `SECTION_CATEGORIES.MARKETING` for organizational purposes.

## Accessibility
- Semantic HTML with proper heading hierarchy
- Alt text support for images
- Keyboard navigation for links and buttons
- ARIA-compliant card interactions
- Color contrast compliance

## Performance
- Lazy loading skeleton during data fetch
- Optimized image loading
- Efficient grid rendering
- Minimal re-renders with React best practices

## Related Sections
- Current Promotions - Similar card layout for promotional content
- Promotional Content - Alternative marketing content display
- Popular Routes - Related travel information display

## Maintenance
When updating:
1. Ensure CMS schema changes are reflected in TypeScript types
2. Update translations for new languages
3. Test responsive behavior on all breakpoints
4. Verify image loading and fallback handling
5. Check link navigation (internal vs external)

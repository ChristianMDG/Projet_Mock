# News Section - Quick Start Guide

## 🚀 Quick Setup

### 1. Restart Strapi CMS
After deploying the new components, restart Strapi to load the new schema:
```bash
cd cms
npm run develop
```

### 2. Create News Content in Strapi

1. Go to **Content Manager** → **Dynamic Page**
2. Select an existing page or create a new one
3. In the **Sections** zone, click **Add a component**
4. Select **News Section**
5. Fill in the fields:
   - **Title**: "Actualités" (or your preferred title)
   - **Subtitle**: Optional description
   - **Background Color**: Leave default or customize
   - **Container Max Width**: Select lg (recommended)

### 3. Add News Items

For each news article:
1. Click **Add an entry** under News Items
2. Fill in:
   - **Title**: Headline (max 200 chars)
   - **Description**: Brief summary
   - **Category**: Content type (e.g., "Nouvelle destination", "Promotion")
   - **Image**: Upload or select an image (optional but recommended)
   - **Link**: URL to full article (optional)
   - **Button Text**: Custom CTA text (defaults to "Read More")

### 4. Save and Publish
- Click **Save**
- Click **Publish** to make it live

## 📋 Example News Items

Based on the image provided, here are sample news items:

### Item 1: Las Vegas Direct Flight
```
Title: Las Vegas en vol direct
Description: Envolez-vous vers le Nevada dès avril 2026. Réservez sans attendre !
Category: Nouvelle destination
Link: /destinations/las-vegas
Button Text: Réserver
Image: [Upload scenic Las Vegas/desert road image]
```

### Item 2: Newsletter
```
Title: Newsletter Air France
Description: Inscrivez-vous à notre newsletter pour recevoir les dernières offres et informations.
Category: Newsletter
Link: /newsletter/subscribe
Button Text: S'inscrire
Image: [Upload blue envelope image]
```

### Item 3: Mobile App
```
Title: L'app fait le plein de nouveautés
Description: Avec l'application Air France, gérez votre voyage, de l'achat du billet jusqu'à votre arrivée à destination.
Category: Application
Link: /app/download
Button Text: Télécharger
Image: [Upload app screenshot image]
```

### Item 4: Train + Air Offer
```
Title: Offre Train + Air dès 525 €
Description: Jusqu'au 5 mars 2026, profitez de notre offre Train + Air vers la Martinique, la Guadeloupe et la Guyane !
Category: Promotion
Link: /promotions/train-air
Button Text: Réserver
Image: [Upload person with sunglasses/travel image]
```

## 🎨 Image Guidelines

### Recommended Specifications
- **Aspect Ratio**: 16:9 (landscape)
- **Minimum Size**: 800x450px
- **Optimal Size**: 1200x675px
- **Format**: JPG or WebP
- **File Size**: Under 500KB (optimized)

### Image Tips
- Use high-quality, professional photos
- Ensure good contrast for text overlay
- Keep focal point centered
- Use consistent style across all news items

## 🌍 Multi-Language Support

The section automatically supports translations. To add content in multiple languages:

1. In Strapi, select the language from the locale dropdown
2. Fill in translated content for:
   - Section title and subtitle
   - News item titles and descriptions
   - Category labels
   - Button text
3. Save and publish for each locale

## 📱 Preview

The section will display as:
- **Desktop (lg+)**: 3 cards per row
- **Tablet (md)**: 2 cards per row
- **Mobile (sm/xs)**: 1 card per row

Each card includes:
- Featured image (if provided)
- Category chip
- Title
- Description
- Call-to-action button (if link provided)

## 🔧 Customization Options

### Background Colors
Common values:
- `background.default` - Default page background
- `background.paper` - Card/paper background
- `grey.50` - Light grey
- `primary.light` - Light brand color

### Container Widths
- `xs` - Extra small (444px)
- `sm` - Small (600px)
- `md` - Medium (900px)
- `lg` - Large (1200px) ⭐ Recommended
- `xl` - Extra large (1536px)

## ✅ Checklist

Before publishing:
- [ ] Section title is clear and descriptive
- [ ] All news items have titles and descriptions
- [ ] Images are uploaded and properly sized
- [ ] Categories are meaningful and consistent
- [ ] Links are tested and working
- [ ] Content is translated (if multi-language)
- [ ] Preview looks good on mobile and desktop
- [ ] Published and visible on frontend

## 🐛 Troubleshooting

### Section not appearing in Strapi
- Restart Strapi: `npm run develop`
- Clear browser cache
- Check schema.json includes "page.news-section"

### Images not displaying
- Verify image upload was successful
- Check image URL in API response
- Ensure image permissions are correct

### Translations not working
- Verify i18n plugin is enabled
- Check locale is set correctly
- Ensure fields have localized: true

## 📚 Related Documentation
- [README-DYNAMIC-PAGES.md](.github/instructions/README-DYNAMIC-PAGES.md) - Full dynamic pages guide
- [NEWS-SECTION.md](.github/instructions/NEWS-SECTION.md) - Detailed technical documentation

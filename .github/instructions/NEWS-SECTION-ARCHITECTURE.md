# News Section - Architecture Diagram

## 🏗️ Complete Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              STRAPI CMS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  cms/src/components/page/                                                  │
│  ├── news-item.json                                                        │
│  │   ├── title: string (required, i18n)                                   │
│  │   ├── description: text (required, i18n)                               │
│  │   ├── image: media (optional)                                          │
│  │   ├── category: string (required, i18n)                                │
│  │   ├── link: string (optional)                                          │
│  │   └── buttonText: string (i18n, default: "En savoir plus")            │
│  │                                                                          │
│  └── news-section.json                                                     │
│      ├── title: string (required, i18n, default: "Actualités")           │
│      ├── subtitle: string (optional, i18n)                                │
│      ├── newsItems: component[] (repeatable, news-item)                   │
│      ├── backgroundColor: string (default: "background.default")          │
│      └── containerMaxWidth: enum (xs|sm|md|lg|xl, default: lg)           │
│                                                                             │
│  cms/src/api/dynamic-page/content-types/dynamic-page/schema.json          │
│  └── sections.components[] includes "page.news-section"                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ REST API
                                    │ /api/dynamic-pages?populate=deep
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  front/src/api/dynamic-page.api.ts                                         │
│  ├── interface NewsItem                                                    │
│  │   ├── id: number                                                        │
│  │   ├── title: string                                                     │
│  │   ├── description: string                                               │
│  │   ├── image?: StrapiMedia                                               │
│  │   ├── category: string                                                  │
│  │   ├── link?: string                                                     │
│  │   └── buttonText?: string                                               │
│  │                                                                          │
│  └── interface NewsSection                                                 │
│      ├── id: number                                                         │
│      ├── __component: 'page.news-section'                                  │
│      ├── title: string                                                      │
│      ├── subtitle?: string                                                  │
│      ├── newsItems: NewsItem[]                                              │
│      ├── backgroundColor?: string                                           │
│      └── containerMaxWidth?: ContainerMaxWidth                              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  front/src/constants/section.types.ts                                      │
│  └── SECTION_TYPES.NEWS_SECTION = 'page.news-section'                     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  front/src/components/section/                                             │
│  ├── Section.tsx (Router)                                                  │
│  │   ├── SECTION_COMPONENTS[NEWS_SECTION] → NewsSection                   │
│  │   └── SECTION_SKELETONS[NEWS_SECTION] → NewsSectionSkeleton            │
│  │                                                                          │
│  ├── NewsSection.tsx (Main Component)                                      │
│  │   └── Renders:                                                          │
│  │       ├── Box (container with bgcolor)                                  │
│  │       │   └── Container (maxWidth)                                      │
│  │       │       ├── Typography (title with Article icon)                  │
│  │       │       ├── Typography (subtitle)                                 │
│  │       │       └── Grid (container)                                      │
│  │       │           └── Grid items (xs:12, sm:6, md:4)                    │
│  │       │               └── Card (for each news item)                     │
│  │       │                   ├── CardMedia (image)                         │
│  │       │                   ├── CardContent                               │
│  │       │                   │   ├── Chip (category)                       │
│  │       │                   │   ├── Typography (title)                    │
│  │       │                   │   └── Typography (description)              │
│  │       │                   └── CardActions                               │
│  │       │                       └── Button (with ArrowForward icon)       │
│  │                                                                          │
│  └── skeleton/NewsSectionSkeleton.tsx (Loading State)                      │
│      └── Renders skeleton placeholders matching main component             │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  front/src/locales/                                                         │
│  ├── en/translation.json → "read_more": "Read More"                       │
│  ├── fr/translation.json → "read_more": "En savoir plus"                  │
│  └── mg/translation.json → "read_more": "Hamaky bebe kokoa"               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

```
1. Content Editor creates news in Strapi
   ↓
2. Strapi stores in database with i18n support
   ↓
3. Frontend requests page via React Query
   ↓
4. API returns dynamic page with sections
   ↓
5. Section.tsx routes to NewsSection component
   ↓
6. NewsSection renders cards in grid
   ↓
7. User clicks button → navigates to link
```

## 📦 Component Hierarchy

```
DynamicPage
└── Section (router)
    └── NewsSection
        └── Container
            ├── Box (header)
            │   ├── Typography (title + icon)
            │   └── Typography (subtitle)
            └── Grid (container)
                └── Grid (items) × N
                    └── Card
                        ├── CardMedia (image)
                        ├── CardContent
                        │   ├── Chip (category)
                        │   ├── Typography (title)
                        │   └── Typography (description)
                        └── CardActions
                            └── Button (CTA)
```

## 🎨 Responsive Breakpoints

```
┌─────────────────────────────────────────────────────────────┐
│ xs (0-600px)        │ 1 column                              │
│ Mobile              │ ┌─────────────────┐                   │
│                     │ │   News Card 1   │                   │
│                     │ └─────────────────┘                   │
│                     │ ┌─────────────────┐                   │
│                     │ │   News Card 2   │                   │
│                     │ └─────────────────┘                   │
├─────────────────────────────────────────────────────────────┤
│ sm-md (600-900px)   │ 2 columns                             │
│ Tablet              │ ┌────────┐ ┌────────┐                 │
│                     │ │ Card 1 │ │ Card 2 │                 │
│                     │ └────────┘ └────────┘                 │
│                     │ ┌────────┐ ┌────────┐                 │
│                     │ │ Card 3 │ │ Card 4 │                 │
│                     │ └────────┘ └────────┘                 │
├─────────────────────────────────────────────────────────────┤
│ lg+ (900px+)        │ 3 columns                             │
│ Desktop             │ ┌─────┐ ┌─────┐ ┌─────┐               │
│                     │ │ C 1 │ │ C 2 │ │ C 3 │               │
│                     │ └─────┘ └─────┘ └─────┘               │
│                     │ ┌─────┐ ┌─────┐ ┌─────┐               │
│                     │ │ C 4 │ │ C 5 │ │ C 6 │               │
│                     │ └─────┘ └─────┘ └─────┘               │
└─────────────────────────────────────────────────────────────┘
```

## 🔌 Integration Points

### 1. CMS Integration
- Strapi Content-Type Builder
- Dynamic Page sections zone
- Media library for images
- i18n plugin for translations

### 2. Frontend Integration
- React Query for data fetching
- Material-UI for components
- i18next for translations
- React Router for navigation

### 3. Section Provider
- Caches shared sections
- Provides section lookup
- Manages loading states

## 🎯 Key Design Decisions

### Why Card-Based Layout?
- Visual hierarchy
- Easy to scan
- Mobile-friendly
- Consistent with other sections

### Why Grid System?
- Responsive by default
- Flexible column layout
- Consistent spacing
- Material-UI integration

### Why Separate Item Schema?
- Reusability
- Type safety
- Clear data structure
- Easy to extend

### Why Optional Images?
- Flexibility for content editors
- Graceful degradation
- Performance optimization
- Not all news needs images

## 🚀 Performance Optimizations

1. **Lazy Loading**: Images load on demand
2. **Skeleton States**: Perceived performance
3. **Efficient Rendering**: React.memo where needed
4. **Optimized Images**: Strapi image processing
5. **Code Splitting**: Component-level splitting

## 🔒 Security Considerations

1. **XSS Prevention**: React escapes content
2. **Link Validation**: External links open safely
3. **Image Validation**: Strapi validates uploads
4. **API Security**: Strapi authentication
5. **CORS**: Properly configured

## 📊 Monitoring Points

1. **API Response Time**: Track fetch performance
2. **Image Load Time**: Monitor media delivery
3. **Click-Through Rate**: Track button clicks
4. **Error Rate**: Monitor failed renders
5. **User Engagement**: Track time on section

## 🔄 Update Process

```
Content Update:
1. Editor logs into Strapi
2. Edits news section content
3. Saves and publishes
4. Frontend auto-updates (React Query cache)

Code Update:
1. Modify component files
2. Run type checks
3. Test locally
4. Deploy to production
5. Verify in production
```

## 📚 Related Patterns

This section follows the same pattern as:
- Current Promotions (similar card layout)
- Popular Routes (grid-based display)
- Testimonials (card-based content)
- Destinations Grid (responsive grid)

## 🎓 Learning Resources

- [Material-UI Grid](https://mui.com/material-ui/react-grid2/)
- [React Query](https://tanstack.com/query/latest)
- [Strapi Components](https://docs.strapi.io/dev-docs/backend-customization/models#components)
- [i18next](https://www.i18next.com/)

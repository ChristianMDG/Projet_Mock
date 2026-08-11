---
agent: agent
---

# MUI v7 Dashboard Development - Taxibrousse

## Agent Instructions

- Write MINIMAL code; use shortest syntax with positive conditions and early returns
- Reuse MUI components from `@mui/material`; prefer composition over complex custom components
- Follow MUI v7 design system patterns and theme customization
- **ALWAYS format files**: `npm run format` (Prettier configured)
- Import from `@/` for clean module resolution
- Keep template showcase organized and accessible

## When to Use Dashboard

### ✅ Use Dashboard For
- UI component showcases and demos
- Template gallery for business stakeholders
- Design system documentation
- Rapid prototyping of new UI patterns

### ❌ Don't Use For
- Production business logic → Main frontend (`/front/`)
- Data management → Backend + CMS
- Authentication flows → Main app
- Real transaction processing

## Dashboard Architecture

- **Standalone MUI v7 Showcase**:
- **Framework**: React 18 + Vite 6 + TypeScript
- **UI Library**: MUI v7 (`@mui/material`)
- **Port**: 3001 (separate from main frontend on 5173)
- **Routing**: React Router DOM for template navigation

```
dashboard/
├── src/
│   ├── pages/          # Template showcase pages
│   ├── components/     # Reusable MUI components
│   ├── shared/         # Common utilities (ColorSchemeToggle)
│   ├── themes/         # MUI theme customizations
│   └── assets/         # Static assets
├── package.json        # Vite + MUI + React Router
└── vite.config.ts      # @/ alias + port 3001
```
- **Port**: 3001 (separate from main frontend on 5173)
- **Routing**: React Router DOM for template navigation

```
dashboard/
├── src/
│   ├── pages/          # Template showcase pages
│   ├── components/     # Reusable Joy UI components  
│   ├── shared/         # Common utilities (ColorSchemeToggle)
│   ├── themes/         # Joy UI theme customizations
│   └── assets/         # Static assets
├── package.json        # Vite + Joy UI + React Router
└── vite.config.ts      # @/ alias + port 3001
```

## Template Structure

### Page Component Pattern
```tsx
import { Box, Typography, Card, CardContent } from '@mui/material';
import { ColorSchemeToggle } from '@/shared';

export default function TemplatePage() {
  return (
    <Box sx={{ p: 4 }}>
      <ColorSchemeToggle sx={{ position: 'fixed', top: 16, right: 16 }} />
      
      <Typography variant="h1" sx={{ mb: 3 }}>
        Template Name
      </Typography>
      
      <Card>
        <CardContent>
          {/* Template content */}
        </CardContent>
      </Card>
    </Box>
  );
}
```

### Adding New Template
1. **Create page**: `src/pages/NewTemplatePage.tsx`
2. **Export in index**: `src/pages/index.ts`
3. **Add route**: `src/App.tsx` templateRoutes array
4. **Add to showcase**: `src/pages/HomePage.tsx` templates array

```tsx
// 1. src/pages/NewTemplatePage.tsx
export default function NewTemplatePage() {
  return (
    <Box sx={{ p: 4 }}>
      {/* Template implementation */}
    </Box>
  );
}

// 2. src/pages/index.ts  
export { default as NewTemplatePage } from './NewTemplatePage';

// 3. src/App.tsx
const templateRoutes = [
  { path: '/new-template', element: <NewTemplatePage /> },
  // ... existing routes
];

// 4. src/pages/HomePage.tsx
export const templates: TemplateItem[] = [
  {
    path: '/new-template',
    name: 'New Template',
    description: 'Description of the template functionality',
    icon: <SomeIcon />,
  },
  // ... existing templates
];
```

## MUI v7 Best Practices

### Component Composition
```tsx
// ✅ Good - Compose MUI components
<Card variant="outlined" sx={{ maxWidth: 400 }}>
  <CardContent>
    <Typography variant="h6">Title</Typography>
    <Typography variant="body2">Content</Typography>
  </CardContent>
</Card>

// ❌ Avoid - Complex custom components
<CustomComplexCard title="Title" content="Content" />
```

### Theme Customization
```tsx
// themes/custom.ts
import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  palette: {
    primary: { main: '#0ea5e9' },
  },
});
```

### Responsive Design
```tsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ 
      height: { xs: 'auto', md: 200 },
      p: { xs: 2, sm: 3 } 
    }}>
      Content
    </Card>
  </Grid>
</Grid>
```

## Development Workflow

### Local Development
```bash
cd dashboard
npm run dev        # Start on port 3001
npm run build      # Build for production
npm run preview    # Preview build
npm run format     # Format with Prettier
npm run lint       # ESLint check
```

### Integration with Main Project
- **Independent**: Dashboard runs separately from main app
- **Showcase**: Demonstrates UI patterns for main frontend
- **Reference**: Component patterns can be adapted for main app
- **Testing**: UI components testing ground

## Template Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **Layout** | Page structures | HomePage, ProfilePage |
| **Forms** | Input patterns | SignInSidePage |
| **Data** | Tables, lists | TeamPage, OrderPage |
| **Communication** | Chat, notifications | MessagesPage |
| **Media** | File handling | FilesPage |
| **Business** | Domain-specific | RentalPage |

## Common Patterns

### Color Scheme Toggle
```tsx
import { ColorSchemeToggle } from '@/shared';

// Always include for theme switching
<ColorSchemeToggle sx={{ position: 'fixed', top: 16, right: 16 }} />
```

### Navigation Links
```tsx
import { Link } from 'react-router-dom';
import { Button } from '@mui/joy';

<Button 
  component={Link} 
  to="/template-path"
  variant="soft"
>
  View Template
</Button>
```

### Template Cards
```tsx
<Card 
  variant="outlined"
  sx={{ 
    height: '100%', 
    cursor: 'pointer',
    '&:hover': { boxShadow: 'md' }
  }}
>
  <CardContent>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {icon}
      <Typography level="title-md">{name}</Typography>
    </Box>
    <Typography level="body-sm" sx={{ mt: 1 }}>
      {description}
    </Typography>
  </CardContent>
</Card>
```

## File Organization

```
src/
├── App.tsx                 # Router + theme provider
├── main.tsx                # React root
├── pages/
│   ├── index.ts            # Barrel exports
│   ├── HomePage.tsx        # Template gallery
│   ├── SignInSidePage.tsx  # Auth template
│   ├── OrderPage.tsx       # E-commerce template
│   ├── TeamPage.tsx        # Team management template
│   ├── MessagesPage.tsx    # Chat template
│   ├── ProfilePage.tsx     # User profile template
│   ├── FilesPage.tsx       # File management template
│   ├── RentalPage.tsx      # Rental business template
│   └── FramesxPage.tsx     # Advanced layout template
├── components/             # Reusable MUI components
├── shared/                 # Common utilities
│   └── ColorSchemeToggle.tsx
└── themes/                 # MUI theme customizations
```

## Relationship to Main App

- **Dashboard** (`/dashboard/`) - MUI v7 templates and showcase
- **Frontend** (`/front/`) - Main React app with MUI v7
- **Backend** (`/src/`) - Spring Boot API
- **CMS** (`/cms/`) - Strapi content management

**Dashboard serves as**: UI pattern library, design system showcase, rapid prototyping environment for the main Taxibrousse application.
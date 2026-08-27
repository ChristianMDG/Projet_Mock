# Taxibrousse - AI Development Context

## Custom Agents

These workspace instructions are the **default base context** for every custom agent / rule in `.agents/rules/`.
Each rule adds domain-specific constraints on top of this file; none of them may override the architecture rules, data-flow matrix, or formatting expectations defined here.

Available project rules / agents:
- `Front Developer` - public frontend work in `/front/`
- `Dashboard Developer` - admin dashboard work in `/dashboard/`
- `API Developer` - Spring Boot backend work in `/src/main/java/mg/taxibrousse/`
- `Configurator` - Docker, deployment, infra, and environment configuration
- `CMS Developer` - Strapi content modeling and CMS integration work in `/cms/`
- `Fullstack Developer` - orchestration rule for cross-tier changes; delegates work to the proper specialist rule when possible

## Default Agent Operating Mode

- `AGENTS.md` applies automatically to all workspace chats and remains the base context for every custom rule in `.agents/rules/`
- Custom rules must stay inside their declared layer unless the task is explicitly cross-tier
- If a request spans multiple layers, prefer `Fullstack Developer` instead of stretching a specialist rule beyond its scope
- `Fullstack Developer` routes layer-specific work to specialists through subagent delegation
- `API Developer` may inspect `/front/` and `/dashboard/` consumers after backend contract changes, then delegate required UI follow-up to `Front Developer` and `Dashboard Developer` in parallel
- Keep this file aligned with actual versions, commands, and folder ownership in `package.json`, `pom.xml`, and deployment files

## 🎯 Architecture Overview

**4-tier taxi-brousse reservation system**:
- **Backend**: Spring Boot 3.5 (Java 25) - `/src/main/java/mg/taxibrousse/`
- **Frontend**: React 19 + Vite 6 + MUI v9 - `/front/`
- **CMS**: Strapi 5.34 + Dynamic Pages - `/cms/`
- **Dashboard**: React 19 + Vite 6 + MUI v7 - `/dashboard/`

## ⚡ Quick Start
```bash
# Backend: ./mvnw spring-boot:run (port 8080) | Frontend: cd front && npm run dev (port 5173)
# CMS: cd cms && npm run develop (port 1337) | Dashboard: cd dashboard && npm run dev (port 3001)
# Build: ./mvnw clean package | cd front && npm run build | cd dashboard && npm run build
# Format: cd front && npm run format | cd dashboard && npm run format
```

## 🏗 Tech Stack
- **Backend**: Spring Boot 3.5.7, Java 25, PostgreSQL, Hibernate + Lombok
- **Frontend**: React 19, TypeScript, Vite 6, Material UI v9, Zustand, React Query v5, Formik + Yup
- **CMS**: Strapi 5.34.0, TypeScript, PostgreSQL, Cloudinary, i18n (fr/en/mg)
- **Dashboard**: React 19, TypeScript, Vite 6, Material UI v7, AG Grid, React Router DOM
- **Auth**: JWT (Spring Security OAuth2), Redis token blacklist
- **i18n**: i18next (frontend), `resources.json` (backend), Strapi i18n plugin (CMS)

## 🧠 Core Patterns

### Environment Variables
- **Frontend (Vite)**: ONLY `VITE_*` prefixed vars (e.g., `VITE_API_URL`, `VITE_CMS_API_KEY`)
- **Dual API config**: Backend via `front/src/api/axios.ts`, CMS via `cms.axios.ts`

### Data Flow Decision Matrix
| Need | Backend | CMS | Frontend | Dashboard |
|------|---------|-----|----------|----------|
| Transactional (reservations, payments) | ✅ | ❌ | ❌ | ❌ |
| Marketing content (FAQs, pages) | ❌ | ✅ | ❌ | ❌ |
| Auth/Authorization | ✅ (JWT) | Admin only | Token storage | ❌ |
| Media uploads | Signs URLs | ✅ (Cloudinary) | Display | ❌ |
| Dynamic sections | ❌ | ✅ (page.*) | Render | ❌ |
| Admin UI & operations | ❌ | ❌ | ❌ | ✅ |

**Rule**: Non-developers edit → CMS. Business logic → Backend. UI state → Frontend. Admin UI → Dashboard.

### Unified Type Convention (map-entity-to-cms)
Single source of truth for entity types (CMS-shaped, reused for both backend and CMS data). Backend responses map to CMS shapes at the API layer.
- ✅ **One type per entity** — reuse for both sources. No `Cms*` or `Backend*` prefixes (e.g., use `Product`, not `BackendProduct`).
- ❌ Do not duplicate types or create source-specific naming.

## 📁 Directory Structure
```
front/src/
  api/              # axios.ts, cms.axios.ts, *.api.ts
  components/
    section/        # Dynamic page section components (maps to CMS page.*)
  hooks/            # React Query hooks
  stores/           # Zustand (UI state only)
  types/            # TypeScript types
  constants/
    section.types.ts # SECTION_TYPES enum for CMS components

src/main/java/mg/taxibrousse/
  entities/         # JPA entities
  controllers/      # REST controllers (@CrossOrigin required)
    interfaces/     # Controller interfaces (define Spring annotations)
  services/         # Business logic
  repositories/     # Spring Data JPA
  exceptions/       # Custom exceptions + GlobalExceptionHandler
  dto/              # Data transfer objects

cms/
  src/api/          # Content types (dynamic-page, hero-content, etc.)
  src/components/page/  # Reusable section components (*.json)
  config/plugins.ts # Cloudinary + i18n config

dashboard/src/
  api/              # Backend API calls
  components/       # Reusable admin UI components
  hooks/            # React Query hooks
  pages/            # Admin routes and pages
  shared/           # Common dashboard utilities
  stores/           # Zustand (UI state only)
  themes/           # MUI theme customizations
```

### Code Minimalism & Formatting
- ✅ **String Checks**: Use `StringUtils.hasText(string)` instead of manual null and blank checks like `string == null || string.isBlank()`.
- ✅ Reuse `axios.ts`, `cms.axios.ts`; import from `@/`; use MUI v9 `sx` prop (system props no longer accepted as direct props) for front, MUI v7 for dashboard.
- ✅ **Component Reuse**: Always prioritize existing UI components (e.g., `StyledTab`, `StyledIcon`) over raw MUI components. Do NOT add hardcoded `boxShadow` or custom overrides when base styles/themes are sufficient.
- ✅ **Theme Colors (No hardcoded colors)**: NEVER use fixed colors like `'white'`, `'black'`, hex codes (`'#FFF'`), or hardcoded `rgba`. ALWAYS use the MUI theme palette (e.g., `'primary.main'`, `'primary.contrastText'`, `'background.paper'`, `alpha(theme.palette.primary.main, 0.5)`) to avoid color artifacts, ensure simple customization, and maintain display coherence (like dark mode).
- ✅ **Image Rendering**: Always use `objectFit: 'cover'` along with `height: '100%'` (and width) on images (e.g., `CardMedia`, `Box component="img"`) so they fully fill their container without leaving blank space.
- ✅ **Auto-format & Build**: Always run formatting/build commands (`npm run format`, `npm run build`) in `front` / `dashboard` directories after edits.
- ✅ **Java Imports (Flatten Imports)**: ALWAYS explicitly import classes (e.g., `import java.util.List;`) instead of using wildcard/star imports (`import java.util.*;`).
- ✅ **No Inline Packages**: NEVER use fully qualified class names directly in the code (e.g., avoid `java.util.List<String> list;`). Always import the class at the top of the file and use its simple name in the code.
- ✅ **Always use positive conditions** — guard with the positive case directly. No negation in `if` conditions, no chained/double negations in JSX. Use `if (condition) { ... }` blocks instead of `if (!value) return`. Direct truthy checks are preferred; named booleans (`hasX`, `isReady`) are optional and only worth extracting when the JSX condition would otherwise read awkwardly.
  ```tsx
  // ❌ FORBIDDEN — negated guards and negated JSX conditions
  if (!clientId) return;
  if (!window.google) return;
  {!isLoading && !error && !items?.length && <Empty />}
  {!isLoading && !!items?.length && <List />}

  // ✅ CORRECT — positive guard, direct truthy check
  if (clientId && window.google) {
    initialize();
  }

  // ✅ CORRECT — named positive booleans for JSX
  const hasItems = Boolean(items?.length);
  const showEmpty = isReady && !error && !hasItems;   // internal negation allowed inside a named bool
  const showList  = isReady && hasItems;

  {showEmpty && <Empty />}
  {showList  && <List />}
  ```
- ❌ New axios instances, inline styles, duplicate types, unformatted code, negated guards (`if (!x) return`), chained-negation JSX conditions

## 🎨 Dynamic Sections System

### Adding a New Section Type (dynamic zone)

**1. CMS Component** (`cms/src/components/page/my-section.json`):
```json
{
  "collectionName": "components_page_my_sections",
  "info": { "displayName": "My Section" },
  "attributes": {
    "title": { "type": "string", "required": true },
    "items": { "type": "component", "repeatable": true, "component": "page.my-item" }
  }
}
```

**2. Add to Dynamic Page schema** (`cms/src/api/dynamic-page/content-types/dynamic-page/schema.json`):
```json
"sections": {
  "type": "dynamiczone",
  "components": ["page.my-section", ...]
}
```

**3. Frontend Type** (`front/src/api/dynamic-page.api.ts`):
```typescript
export interface MySection {
  id: number;
  __component: 'page.my-section';
  title: string;
  items: MyItem[];
}
```

**4. Section Constant** (`front/src/constants/section.types.ts`):
```typescript
export const SECTION_TYPES = {
  MY_SECTION: 'page.my-section',
  // ...
} as const;
```

**5. React Component** (`front/src/components/section/MySection.tsx`):
```tsx
const MySection: React.FC<{ section: MySection }> = ({ section }) => (
  <Container><Typography variant="h4">{section.title}</Typography></Container>
);
```

**6. Register in Section.tsx**:
```typescript
const SECTION_COMPONENTS: Record<string, SectionComponent> = {
  [SECTION_TYPES.MY_SECTION]: MySection as SectionComponent,
};
```

**7. Add Skeleton** (`front/src/components/section/skeleton/MySectionSkeleton.tsx`)

## 🔧 Common Patterns

### Backend Controller (Interface-Based Architecture)
- Define all Spring annotations (`@RestController`, `@RequestMapping`, `@PreAuthorize`, `@CrossOrigin`, `@GetMapping`, etc.) in the **Interface** under `controllers/interfaces/`.
- The **Implementation** class only implements the interface and handles business logic/services delegation.
```java
// Contract Interface
@RestController @RequestMapping("/api/authorities") @CrossOrigin(origins = "*")
public interface IAuthorityController {
    @GetMapping ResponseEntity<List<AuthorityEntity>> getAllAuthorities();
}

// Implementation
@RestController @RequiredArgsConstructor
public class AuthorityController implements IAuthorityController {
    private final AuthorityService authorityService;
    @Override public ResponseEntity<List<AuthorityEntity>> getAllAuthorities() {
        return ResponseEntity.ok(authorityService.findAll());
    }
}
```

**Benefits**: Clean separation of API contract (interface) vs implementation, better testability, consistent API definitions across controllers.

### Legacy Backend Controller (Old Pattern)
```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class UserController {
    private final IUserService service;
    
    @GetMapping("/current")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserOperator> getCurrentUser(Authentication auth) {
        return ResponseEntity.ok(service.findByUsername(auth.getName()));
    }
}
```

### React Query Hook & Zustand
- **React Query Hook**: Fetch and cache server data.
```typescript
export function useHeroContent() {
  const { language } = useTranslation();
  return useQuery({ queryKey: ['hero-content', language], queryFn: () => getHeroContent(language) });
}
```
### Zustand (UI State Only)
```typescript
const usePageStore = create<PageState>(set => ({
  drawerOpen: false,
  setDrawerOpen: open => set({ drawerOpen: open }),
}));
```

## 🎨 Code Formatting

**Frontend Formatting (Required)**:
```bash
# After any frontend file modification
cd front && npm run format

# Available scripts:
npm run format        # Format all files with Prettier
npm run format:check  # Check formatting without fixing
npm run lint          # ESLint check
npm run lint:fix      # ESLint fix
```

**Dashboard Formatting (Required)**:
```bash
# After any dashboard file modification
cd dashboard && npm run format
```

**Auto-format on save**: Configure your IDE to run Prettier on save for `.tsx`, `.ts`, `.js`, `.jsx` files in `/front/` and `/dashboard/` directories.

**Pre-commit**: Formatting is enforced via husky hooks - commits will fail if code is not properly formatted.

## 📚 Specialized Guides
- **State Management**: `/.github/prompts/zustand.prompt.md`
- **Server State**: `/.github/prompts/reactquery.prompt.md`
- **Forms**: `/.github/prompts/formik.prompt.md`
- **i18n**: `/.github/prompts/label.prompt.md`
- **UI Components**: `/.github/prompts/mui.prompt.md`
- **Formatting**: `/.github/prompts/format.prompt.md`
- **Dashboard Development**: `/.github/prompts/dashboard.prompt.md`
- **CMS Development**: `/.github/prompts/strapi.prompt.md`
- **Media**: `/.github/prompts/cloudinary.prompt.md`
- **Dynamic Sections**: `/.github/instructions/README-DYNAMIC-PAGES.md`

---
*Maintain consistency with existing patterns. Keep code minimal and focused.*

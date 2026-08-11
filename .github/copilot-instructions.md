# Taxibrousse - AI Development Context

## Custom Agents

These workspace instructions are the **default base context** for every custom agent in `.github/agents/`.
Each agent adds domain-specific constraints on top of this file; none of them may override the architecture rules, data-flow matrix, or formatting expectations defined here.

Available project agents:
- `Front Developer` - public frontend work in `/front/`
- `Dashboard Developer` - admin dashboard work in `/dashboard/`
- `API Developer` - Spring Boot backend work in `/src/main/java/mg/taxibrousse/`
- `Configurator` - Docker, deployment, infra, and environment configuration
- `CMS Developer` - Strapi content modeling and CMS integration work in `/cms/`
- `Fullstack Developer` - orchestration agent for cross-tier changes; triages the request and delegates the work to the proper specialist agent when possible

## Default Agent Operating Mode

- `.github/copilot-instructions.md` applies automatically to all workspace chats and remains the base context for every custom agent in `.github/agents/`
- Custom agents must stay inside their declared layer unless the task is explicitly cross-tier
- If a request spans multiple layers, prefer `Fullstack Developer` instead of stretching a specialist agent beyond its scope
- `Fullstack Developer` should route layer-specific work to `Front Developer`, `Dashboard Developer`, `API Developer`, `CMS Developer`, or `Configurator` through subagent delegation instead of acting as a catch-all specialist
- `API Developer` may inspect `/front/` and `/dashboard/` consumers after backend contract changes, then delegate required UI follow-up to `Front Developer` and `Dashboard Developer`; when the follow-up tasks are independent, that delegation may happen in parallel
- Keep this file aligned with actual versions, commands, and folder ownership in `package.json`, `pom.xml`, and deployment files

## 🎯 Architecture Overview

**4-tier taxi-brousse reservation system**:
- **Backend**: Spring Boot 3.5 (Java 25) - `/src/main/java/mg/taxibrousse/`
- **Frontend**: React 19 + Vite 6 + MUI v9 - `/front/`
- **CMS**: Strapi 5.34 + Dynamic Pages - `/cms/`
- **Dashboard**: React 19 + Vite 6 + MUI v9 - `/dashboard/`
## ⚡ Quick Start
```bash
# Backend: ./mvnw spring-boot:run (port 8080)
# Frontend: cd front && npm run dev (port 5173)
# CMS: cd cms && npm run develop (port 1337)
# Dashboard: cd dashboard && npm run dev (port 3001)
# Full build: ./mvnw clean package
# Format frontend: cd front && npm run format
# Build frontend: cd front && npm run build
# Format dashboard: cd dashboard && npm run format
# Build dashboard: cd dashboard && npm run build
```

## 🧠 Core Patterns

### Environment Variables
- **Frontend (Vite)**: ONLY `VITE_*` prefixed vars (e.g., `VITE_API_URL`, `VITE_CMS_API_KEY`)
- **Dual API config**: Backend via `front/src/api/axios.ts`, CMS via `cms.axios.ts`

### Data Flow Decision Matrix
| Need | Backend | CMS | Frontend | Dashboard |
|------|---------|-----|----------|----------|
| Transactional (reservations, payments) | ✅ | ❌ | ❌ | ❌ |
| Marketing content (FAQs, pages) | ❌ | ✅ | ❌ | ❌ |
| Auth/Authorization | ✅ (JWT/Spring Security) | Admin only | Token storage | ❌ |
| Media uploads | Signs URLs | ✅ (Cloudinary) | Display | ❌ |
| Dynamic sections | ❌ | ✅ (page.* components) | Render | ❌ |
| Admin UI & operations | ❌ | ❌ | ❌ | ✅ |

**Rule**: Non-developers edit → CMS. Business logic → Backend. UI state → Frontend. Admin UI → Dashboard.

### Code Minimalism & Formatting
- ✅ Reuse `axios.ts`, `cms.axios.ts`; import from `@/`; use MUI v9 `sx` prop (system props no longer accepted as direct props)
- ✅ **Always run Prettier after modifying frontend files**: `cd front && npm run format`
- ✅ **Always build after modifying frontend files**: `cd front && npm run build`
- ✅ **Always run Prettier after modifying dashboard files**: `cd dashboard && npm run format`
- ✅ **Always build after modifying dashboard files**: `cd dashboard && npm run build`
- ✅ **Always use positive conditions** — check for success/valid cases first, use early returns for errors. Extract named booleans so JSX conditions read positively. **This rule is mandatory; do not skip it.**

  ```tsx
  // ❌ FORBIDDEN — chained negations and double-negation in JSX
  if (!phone && !idNumber) return;
  {!isLoading && !error && !items?.length && <Empty />}
  {!isLoading && !!items?.length && <List />}

  // ✅ CORRECT — named positive booleans, guard with positive condition
  const hasInput = Boolean(phone || idNumber);
  const hasItems = Boolean(items?.length);
  const showEmpty = isReady && !error && !hasItems;   // internal negation allowed inside a named bool
  const showList  = isReady && hasItems;

  if (hasInput) { /* proceed */ }
  {showEmpty && <Empty />}
  {showList  && <List />}
  ```

- ❌ New axios instances, inline styles, duplicate types, unformatted code, negated JSX conditions

## 🏗 Tech Stack
- **Backend**: Spring Boot 3.5.7, Java 25, PostgreSQL, Hibernate + Lombok
- **Frontend**: React 19, TypeScript, Vite 6, Material UI v9, Zustand, React Query v5, Formik + Yup
- **CMS**: Strapi 5.34.0, TypeScript, PostgreSQL, Cloudinary, i18n (fr/en/mg)
- **Dashboard**: React 19, TypeScript, Vite 6, Material UI v9, AG Grid, React Router DOM
- **Auth**: JWT (Spring Security OAuth2), Redis token blacklist
- **i18n**: i18next (frontend), `resources.json` (backend), Strapi i18n plugin (CMS)

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

## 🎨 Dynamic Sections System

### Adding a New Section Type

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

**Auto-format on save**: Configure your IDE to run Prettier on save for `.tsx`, `.ts`, `.js`, `.jsx` files in `/front/` directory.

**Pre-commit**: Formatting is enforced via husky hooks - commits will fail if code is not properly formatted.

## 🔧 Common Patterns

### Backend Controller (Interface-Based Architecture)

**Controller Interface** (defines all Spring annotations):
```java
@RestController
@RequestMapping("/api/authorities")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("hasAuthority('ADMIN')")
public interface IAuthorityController {
    
    @GetMapping
    ResponseEntity<List<AuthorityEntity>> getAllAuthorities();
    
    @GetMapping("/{id}")
    ResponseEntity<AuthorityEntity> getAuthorityById(@PathVariable Long id);
    
    @PostMapping
    ResponseEntity<AuthorityEntity> createAuthority(@RequestBody AuthorityEntity authority);
}
```

**Controller Implementation** (only business logic):
```java
@RestController
@RequiredArgsConstructor
public class AuthorityController implements IAuthorityController {
    private final AuthorityService authorityService;
    
    @Override
    public ResponseEntity<List<AuthorityEntity>> getAllAuthorities() {
        return ResponseEntity.ok(authorityService.findAll());
    }
    
    @Override
    public ResponseEntity<AuthorityEntity> getAuthorityById(Long id) {
        return authorityService.findById(id).map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
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

### React Query Hook (CMS)
```typescript
export function useHeroContent() {
  const { language } = useTranslation();
  return useQuery({
    queryKey: ['hero-content', language],
    queryFn: () => getHeroContent(language),
  });
}
```

### Zustand (UI State Only)
```typescript
const usePageStore = create<PageState>(set => ({
  drawerOpen: false,
  setDrawerOpen: open => set({ drawerOpen: open }),
}));
```

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

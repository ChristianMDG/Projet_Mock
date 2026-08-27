# Taxibrousse - AI Development Context (Gemini & Antigravity)

## 🤖 Custom Agents & Roles

Available project rules / agents:
- `Fullstack Developer` - orchestration rule for cross-tier changes; delegates work to the proper specialist rule
- `Front Developer` - public frontend work in `/front/` (React 19 + Vite 6 + MUI v9)
- `Dashboard Developer` - admin dashboard work in `/dashboard/` (React 19 + Vite 6 + MUI v7)
- `API Developer` - Spring Boot backend work in `/src/main/java/mg/taxibrousse/`
- `CMS Developer` - Strapi content modeling and CMS integration work in `/cms/`
- `Configurator` - Docker, deployment, infra, and environment configuration

## 🧭 Default Agent Operating Mode

- `GEMINI.md` and `AGENTS.md` apply automatically to all workspace chats and remain the base context for every custom rule in `.agents/rules/`.
- Custom rules must stay inside their declared layer unless the task is explicitly cross-tier.
- If a request spans multiple layers, prefer `Fullstack Developer` instead of stretching a specialist rule beyond its scope.
- `Fullstack Developer` routes layer-specific work to specialists through subagent delegation.
- `API Developer` may inspect `/front/` and `/dashboard/` consumers after backend contract changes, then delegate required UI follow-up to `Front Developer` and `Dashboard Developer` in parallel.
- Default to minimalist, production-ready code. Keep diffs small, focused, and positive.
- **DO NOT create new .md files** to document implementations; update existing docs inline.

---

## 🎯 Architecture Overview

**4-tier taxi-brousse reservation & e-commerce system**:
- **Backend**: Spring Boot 3.5.7 (Java 25) - `/src/main/java/mg/taxibrousse/` (Port 8080)
- **Frontend**: React 19 + Vite 6 + Material UI v9 + Zustand + React Query v5 - `/front/` (Port 5173 / Docker 3000)
- **CMS**: Strapi 5.34.0 + Dynamic Pages + Cloudinary + i18n (fr/en/mg) - `/cms/` (Port 1337)
- **Dashboard**: React 19 + Vite 6 + Material UI v7 + AG Grid - `/dashboard/` (Port 3001)

## ⚡ Quick Start Commands
```bash
# Backend: ./mvnw spring-boot:run (port 8080)
# Frontend: cd front && npm run dev (port 5173)
# CMS: cd cms && npm run develop (port 1337)
# Dashboard: cd dashboard && npm run dev (port 3001)
# Build: ./mvnw clean package | cd front && npm run build | cd dashboard && npm run build
# Format: cd front && npm run format | cd dashboard && npm run format
```

---

## 🧭 Responsibility & Data Flow Decision Matrix

| Need | Backend (`/src/`) | CMS (`/cms/`) | Frontend (`/front/`) | Dashboard (`/dashboard/`) |
|------|:-----------------:|:------------:|:--------------------:|:-------------------------:|
| Transactional (reservations, orders, payments) | ✅ | ❌ | ❌ | ❌ |
| Operational entities (Users, Voyages, Seats, Tarifs) | ✅ | ❌ | ❌ | ❌ |
| Marketing content (FAQs, hero, dynamic pages) | ❌ | ✅ | ❌ | ❌ |
| Dynamic sections (page.*) | ❌ | ✅ (schema) | Render | ❌ |
| SEO metadata & pages | ❌ | ✅ | Render | ❌ |
| Auth & Authorization | ✅ (Spring Security JWT) | Admin only | Token storage | Token storage |
| Media uploads & assets | Signs URLs | ✅ (Cloudinary) | Display | Display |
| Form validation | ✅ (server-side) | ❌ | ✅ (Formik/Yup) | ✅ (Formik/Yup) |
| UI labels / i18n | ✅ (resources.json) | ✅ (i18n plugin) | ✅ (labelKeys.json) | ✅ (labelKeys.json) |
| Admin UI & operations | ❌ | ❌ | ❌ | ✅ |

**Golden Rule**: Non-developers edit → CMS. Business logic → Backend. UI state → Frontend. Admin UI → Dashboard.

---

## 🧠 Core Patterns & Rules

### 1. Unified Type Convention (`map-entity-to-cms`)
Single source of truth for entity types (CMS-shaped, reused for both backend and CMS data). Backend responses map to CMS shapes at the API layer.
- ✅ **One type per entity** — reuse for both sources. No `Cms*` or `Backend*` prefixes (e.g., use `Product`, not `BackendProduct`).
- ❌ Do not duplicate types or create source-specific naming.

### 2. Environment Variables & APIs
- **Frontend (Vite)**: ONLY `VITE_*` prefixed variables (e.g., `VITE_API_URL`, `VITE_CMS_API_KEY`).
- **Dual API config**: Backend via `front/src/api/axios.ts`, CMS via `cms.axios.ts`. Never create new Axios instances.

### 3. Code Minimalism, Formatting & Theme Colors
- ✅ **String Checks**: Use `StringUtils.hasText(string)` instead of manual null and blank checks.
- ✅ **Component Reuse**: Prioritize existing UI components (e.g., `StyledTab`, `StyledIcon`) over raw MUI components. Avoid hardcoded `boxShadow` or custom CSS overrides.
- ✅ **Theme Colors (No hardcoded colors)**: NEVER use fixed colors (`'white'`, `'black'`, `'#FFF'`, `rgba(...)`). ALWAYS use the MUI theme palette (`'primary.main'`, `'secondary.main'`, `'background.paper'`, `'text.primary'`, `alpha(theme.palette.primary.main, 0.5)`).
- ✅ **Image Rendering**: Always use `objectFit: 'cover'` along with `height: '100%'` (and width) on images (`CardMedia`, `Box component="img"`).
- ✅ **Always use positive conditions**: Guard with the positive case directly. No negation in `if` conditions, no chained/double negations in JSX. Use `if (condition) { ... }` blocks. Direct truthy checks are preferred; named positive booleans (`hasItems`, `isReady`) for JSX.
- ✅ **Java Imports**: Always explicitly import classes (`import java.util.List;`) instead of wildcard imports (`import java.util.*;`). Never use inline fully qualified class names.
- ✅ **Auto-format & Build**: Always run formatting/build commands (`npm run format`, `npm run build`) in `front` / `dashboard` directories after modifications.

---

## 🔧 Component & Controller Architecture

### Backend Controller (Interface-Based Architecture)
- Define all Spring annotations (`@RestController`, `@RequestMapping`, `@PreAuthorize`, `@CrossOrigin`, `@GetMapping`, etc.) in the **Interface** under `controllers/interfaces/`.
- The **Implementation** class only implements the interface and delegates to services.
```java
// Contract Interface
@RestController
@RequestMapping("/api/entities")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IEntityController {
    @GetMapping
    ResponseEntity<List<EntityDto>> getAll();
}

// Implementation
@RestController
@RequiredArgsConstructor
public class EntityController implements IEntityController {
    private final EntityService entityService;
    @Override
    public ResponseEntity<List<EntityDto>> getAll() {
        return ResponseEntity.ok(entityService.findAll());
    }
}
```

### Frontend State Management
- **React Query Hooks (`hooks/`)**: Server state fetching, caching, mutation, and invalidation.
- **Zustand (`stores/`)**: Pure UI state only (modals, drawers, steps, local selection).

---

## 🎨 Dynamic Sections System (CMS → Front)

1. **CMS Component**: Create JSON schema in `cms/src/components/page/my-section.json`.
2. **Dynamic Page Schema**: Register component in `cms/src/api/dynamic-page/content-types/dynamic-page/schema.json` under `"sections"` dynamiczone.
3. **Frontend Type**: Add `MySection` interface with `__component: 'page.my-section'` in `front/src/api/dynamic-page.api.ts`.
4. **Section Constant**: Add `MY_SECTION: 'page.my-section'` in `front/src/constants/section.types.ts`.
5. **React Component**: Create `front/src/components/section/MySection.tsx` and register in `SECTION_COMPONENTS` in `Section.tsx`.
6. **Skeleton**: Create `front/src/components/section/skeleton/MySectionSkeleton.tsx`.

---

## 🌐 Internationalization (i18n)

| Layer | File / Location | Rule |
|-------|----------------|------|
| **Frontend UI** | `front/src/labelKeys.json` + `locales/*.json` | Add key to `labelKeys.json`, use `t(Labels.key)` |
| **Dashboard UI** | `dashboard/src/labelKeys.json` + `locales/fr.json` + `locales/mg.json` | Add to all 3 files simultaneously |
| **Backend Messages** | `src/main/resources/resources.json` | Add `{ "key": "...", "mg": "...", "fr": "...", "en": "..." }` |
| **CMS Content** | Strapi i18n Plugin | fr, en, mg locales |

---

## 📚 Specialized Prompts & Guides Reference
- **Development Workflow**: `/.github/prompts/dev.prompt.md`
- **State Management (Zustand)**: `/.github/prompts/zustand.prompt.md`
- **Server State (React Query)**: `/.github/prompts/reactquery.prompt.md`
- **Form Validation (Formik + Yup)**: `/.github/prompts/formik.prompt.md`
- **i18n & Labels**: `/.github/prompts/label.prompt.md`
- **UI & Material UI**: `/.github/prompts/mui.prompt.md`
- **Dashboard Development**: `/.github/prompts/dashboard.prompt.md`
- **CMS Development (Strapi)**: `/.github/prompts/strapi.prompt.md`
- **Media & Cloudinary**: `/.github/prompts/cloudinary.prompt.md`
- **Code Formatting**: `/.github/prompts/format.prompt.md`
- **Dynamic Pages & Sections**: `/.github/instructions/README-DYNAMIC-PAGES.md`

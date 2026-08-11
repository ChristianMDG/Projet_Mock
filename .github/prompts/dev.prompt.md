---
agent: agent
---

# Development Workflow - Taxibrousse
**Note:** Remove deprecated dev patterns and keep instructions aligned with current stack (React 19, Vite 6, MUI v7, React Query v5). Prefer small diffs and reuse existing utilities.

## 🤖 Agent Instructions

- Default to minimalist, production-ready code. Keep diffs small and focused.
- Reuse existing modules (API clients, hooks, stores) instead of recreating.
- Surface security and data ownership decisions explicitly.
- **DO NOT create new .md files** to document implementations; update existing docs inline.

## 🧭 Responsibility Decision Matrix

| Need | Backend | CMS | Frontend |
|------|---------|-----|----------|
| Transactional data (reservations, payments) | ✅ | ❌ | ❌ |
| Operational entities (Users, Voyages, Seats) | ✅ | ❌ | ❌ |
| Marketing content (FAQs, Pages) | ❌ | ✅ | ❌ |
| Dynamic sections | ❌ | ✅ (page.*) | Render |
| SEO metadata | ❌ | ✅ | ❌ |
| Auth & Authorization | ✅ (Spring Security) | Admin only | Token storage |
| Media optimization | Assist | ✅ (Cloudinary) | Display |
| Form validation | ✅ (server) | Optional | ✅ (Formik/Yup) |
| i18n static content | ❌ | ✅ (i18n plugin) | ❌ |
| UI labels | ✅ (resources.json) | ❌ | ✅ (labelKeys) |

**Rule**: Non-developers edit → CMS. Business logic → Backend. UI state → Frontend.

## 🚀 Feature Implementation Workflow

### 1. Analysis
- Clarify scope, data flow, security exposure, i18n impact
- Decide layer using Decision Matrix

### 2. Backend (Spring Boot 3.4 + Java 21)
```
src/main/java/mg/taxibrousse/
├── entities/       # JPA Entity + Lombok
├── dto/            # Data Transfer Objects  
├── repositories/   # I{Entity}Repository extends JpaRepository
├── services/       # I{Entity}Service + implementation
├── controllers/    # Interface-based architecture
│   └── interfaces/ # Controller interfaces (annotations)
└── exceptions/     # Custom exceptions + GlobalExceptionHandler
```

**Interface-Based Controller Pattern**:

**Controller Interface** (defines Spring annotations):
```java
@RestController
@RequestMapping("/api/entities")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("hasAuthority('ADMIN')")
public interface IEntityController {
    
    @GetMapping
    ResponseEntity<List<EntityDto>> getAll();
    
    @PostMapping 
    ResponseEntity<EntityDto> create(@RequestBody CreateEntityDto dto);
}
```

**Controller Implementation** (business logic only):
```java
@RestController
@RequiredArgsConstructor
public class EntityController implements IEntityController {
    private final EntityService entityService;
    
    @Override
    public ResponseEntity<List<EntityDto>> getAll() {
        return ResponseEntity.ok(entityService.findAll());
    }
}
@RequestMapping("/api/example")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class ExampleController {
    private final IExampleService service;
    
    @GetMapping
    public ResponseEntity<List<Example>> list() {
        return ResponseEntity.ok(service.findAll());
    }
}
```

### 3. CMS (Strapi) - If Marketing Content
```
cms/src/
├── api/{content-type}/content-types/{name}/schema.json
└── components/page/{section}.json  # For dynamic sections
```

See `/.github/prompts/strapi.prompt.md` for details.

### 4. Frontend (React)
```
front/src/
├── types/          # TypeScript types
├── api/            # API functions (axios.ts, cms.axios.ts)
├── hooks/          # React Query hooks
├── stores/         # Zustand (UI state only)
├── components/     # React components
│   └── section/    # Dynamic page sections
└── pages/          # Route pages
```

**React Query Hook**:
```typescript
export function useExamples() {
  return useQuery({
    queryKey: ['examples'],
    queryFn: getExamples,
  });
}

export function useCreateExample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createExample,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['examples'] }),
  });
}
```

**Zustand (UI State Only)**:
```typescript
const usePageStore = create<PageState>(set => ({
  drawerOpen: false,
  setDrawerOpen: open => set({ drawerOpen: open }),
}));
```

### 5. Dynamic Sections (CMS → Frontend)

See `/.github/instructions/README-DYNAMIC-PAGES.md` for complete guide.

**Quick Steps**:
1. Create CMS component: `cms/src/components/page/my-section.json`
2. Add to dynamic-page schema
3. Add TypeScript type: `front/src/api/dynamic-page.api.ts`
4. Add constant: `front/src/constants/section.types.ts`
5. Create React component: `front/src/components/section/MySection.tsx`
6. Create skeleton
7. Register in `Section.tsx`

### 6. Internationalization

| Type | Source | File |
|------|--------|------|
| UI labels | Frontend | `labelKeys.json` + i18next |
| Backend messages | Backend | `resources.json` |
| CMS content | CMS | Strapi i18n plugin |

**Add new key**:
1. Add to `front/src/labelKeys.json`: `"my_key": "my_key"`
2. Add to `src/main/resources/resources.json`:
```json
{ "key": "my_key", "mg": "...", "fr": "...", "en": "..." }
```

### 7. Testing
- Backend: JUnit, Spring Boot Test
- Frontend: React Testing Library, Jest
- CMS: Manual regression

### 8. Documentation
- Update existing README.md sections
- Don't create separate .md files per feature

## ☕ Java Best Practices

### Simplify Collections
```java
// ✅ Prefer
List.of("item1", "item2")
Set.of("a", "b")

// ❌ Avoid
Arrays.asList("item1", "item2")
```

### Simplify Conditionals
```java
// ✅ Ternary for simple if-else
Entity entity = id > 0 
    ? repository.findById(id).orElse(new Entity())
    : new Entity();

// ✅ Early returns
private String validate(Model model) {
    if (!isValid(model.getField())) return ERROR_INVALID;
    if (isDuplicate(model.getField())) return ERROR_DUPLICATE;
    return null;
}

// ✅ Single-line conditionals
if (model.getPhoto() != null) entity.setPhoto(savePhoto(model.getPhoto()));
```

### Model Pattern
```java
// build() method: ONLY basic fields, NOT relations
public static ReservationBuilder<?, ?> toBuilder(ReservationEntity entity) {
    return Reservation.builder()
            .id(entity.getId())
            .bookingReference(entity.getBookingReference())
            .status(entity.getStatus().name());
    // ❌ Don't include: .voyage(Voyage.fromEntity(entity.getVoyage()))
}
```

## 🔐 Security

### Backend
- JWT via Spring Security
- Redis-based token blacklist for logout
- Validate ownership server-side

### CMS
- Minimal public role permissions
- API Tokens (read-only) for server-to-server

### Frontend
- Never expose secrets
- Use `VITE_*` prefix for env vars

## 📁 Directory Conventions

**Backend**: `entities/`, `dto/`, `repositories/` (plural), `services/`, `controllers/`, `config/`

**Frontend**: `api/`, `hooks/`, `stores/`, `components/{feature}/`, `types/`

**CMS**: `cms/src/api/{contentType}/`, `cms/src/components/page/`

## ✅ Pre-Merge Checklist

- [ ] Layer choice validated (Backend vs CMS vs Frontend)
- [ ] Entities / Content Types created
- [ ] API documented
- [ ] i18n keys added
- [ ] React Query keys unique & stable
- [ ] Form validation covers edge cases
- [ ] Tests added/updated
- [ ] README updated (inline, no new .md files)
- [ ] Secrets not committed

## 📚 Specialized Guides

- **State Management**: `zustand.prompt.md`
- **Server State**: `reactquery.prompt.md`
- **Forms**: `formik.prompt.md`
- **i18n**: `label.prompt.md`
- **UI Components**: `mui.prompt.md`
- **CMS**: `strapi.prompt.md`
- **Media**: `cloudinary.prompt.md`
- **Dynamic Sections**: `/.github/instructions/README-DYNAMIC-PAGES.md`

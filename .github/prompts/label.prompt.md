---
agent: agent
---

# i18n Label Management - Taxibrousse
**Note:** Keep i18n keys additive and avoid wide refactors. Validate JSON and prefer using key-as-placeholder until translations are available.

## Agent Instructions

- Add only missing entries; keep keys alphabetical when feasible
- Use key as placeholder translation if real translations unknown
- Validate JSON syntax; avoid trailing commas
- Never reformat whole files
- Use positive conditions for language checks
- **Format frontend files after editing**: `cd front && npm run format`

## i18n Architecture

| Type | Source | File |
|------|--------|------|
| UI labels | Frontend | `front/src/labelKeys.json` + i18next |
| Backend messages | Backend | `src/main/resources/resources.json` |
| CMS content | CMS | Strapi i18n plugin (fr/en/mg) |

## Adding a New Key

### 1. Frontend (`front/src/labelKeys.json`)
```json
{
  "existing_key": "existing_key",
  "my_new_key": "my_new_key"
}
```

### 2. Backend (`src/main/resources/resources.json`)
```json
[
  {
    "key": "my_new_key",
    "mg": "[Malagasy translation]",
    "fr": "[French translation]",
    "en": "[English translation]"
  }
]
```

## Usage in Code

### Frontend
```typescript
import Labels from '@/labelKeys.json';
import { useTranslation } from '@/hooks/translation.hooks';

const MyComponent = () => {
  const { t } = useTranslation();
  return <Typography>{t(Labels.my_new_key)}</Typography>;
};
```

### Backend
```java
// Return key, frontend translates
return "error_invalid_phone";
```

## Fixing Missing Key Errors

When you see:
```
TS2345: Argument of type '"new_key"' is not assignable...
```

1. Add to `front/src/labelKeys.json`
2. Add to `src/main/resources/resources.json`
3. Re-run build

## Key Naming Conventions

| Pattern | Example |
|---------|---------|
| Form fields | `form_field_name` |
| Buttons | `button_action` |
| Errors | `error_description` |
| Success | `success_description` |
| Page titles | `page_name_title` |
| Section | `section_name_title` |

## Languages

- `mg` - Malagasy (default)
- `fr` - French
- `en` - English

## Best Practices

- Keep keys semantic and snake_case
- Add all needed keys upfront for new features
- Don't duplicate existing keys
- Use placeholders: `{field}`, `{count}`

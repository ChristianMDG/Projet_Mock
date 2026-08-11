---
agent: agent
description: Formatting and build verification rules for front and dashboard layers.
---

# Formatting & Build — Taxibrousse

**MANDATORY**: Run Prettier **and** verify the TypeScript build after every modification to `/front/` or `/dashboard/` source files.

## Rules

- After modifying any file under `front/src/`: run `cd front && npm run format` then `cd front && npx tsc --noEmit`
- After modifying any file under `dashboard/src/`: run `cd dashboard && npm run format` then `cd dashboard && npx tsc --noEmit`
- If both layers are modified in the same task: run both format + build commands
- Never leave a task finished without having formatted and type-checked each modified layer
- Formatting is enforced by husky pre-commit hooks — unformatted code will block commits
- TypeScript errors must be zero before the task is considered done

## Commands

```bash
# Frontend — format then type-check
cd front && npm run format
cd front && npx tsc --noEmit

# Dashboard — format then type-check
cd dashboard && npm run format
cd dashboard && npx tsc --noEmit

# Full production build (when needed)
cd front && npm run build
cd dashboard && npm run build

# Check formatting without fixing (CI use)
cd front && npm run format:check
cd dashboard && npm run format:check
```

## When to run

| Modification | Format | Type-check |
|---|---|---|
| Any `.tsx`, `.ts`, `.js`, `.json` in `front/src/` | `cd front && npm run format` | `cd front && npx tsc --noEmit` |
| Any `.tsx`, `.ts`, `.js`, `.json` in `dashboard/src/` | `cd dashboard && npm run format` | `cd dashboard && npx tsc --noEmit` |
| Both layers in same task | Run both format commands | Run both type-check commands |
| CMS (`cms/`) or Backend (`src/main/java/`) | No Prettier needed | `./mvnw compile -q` for backend |

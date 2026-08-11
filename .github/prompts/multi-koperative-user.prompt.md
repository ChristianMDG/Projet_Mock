---
description: "Continue the multi-koperative assignment feature: backend entity + API are done, dashboard assign dialog is done; remaining work is adding koperative selection to the front voyage form for OPERATOR and GUICHET users who have >1 assigned koperative."
agent: "agent"
argument-hint: "Layer or specific sub-task to implement (e.g. 'front koperative selector', 'backend endpoint for guichet koperatives', 'all remaining layers')"
---

# Multi-Koperative User Feature — Continuation

## Context

OPERATOR (`OPERATEUR`) and GUICHET users can now be assigned to **multiple koperatives** from the dashboard.
The goal is: when such a user has **one** assigned koperative it is used automatically (default behaviour, already works); when they have **more than one** they must be able to pick which koperative to operate under before managing voyages on the front-end.

---

## What Is Already Done

### Backend

| Layer | Status | Details |
|-------|--------|---------|
| Entity | ✅ | `UserOperatorEntity.assignedKoperatives` — M:M via `operator_koperatives` join table |
| DTO model | ✅ | `UserOperator.assignedKoperatives: List<Koperative>` |
| Assign endpoint | ✅ | `PUT /api/operators/{id}/assign-koperatives` — replaces whole set |
| Current-user response | ✅ | `assignedKoperatives` is included when `getCurrentUser()` is called |

> **Note**: The single `koperative` relation on `UserOperatorEntity` is superseded by the relational `assignedKoperatives` (M:M). Do **not** read from `user.koperative`; use `user.assignedKoperatives` exclusively.

### Dashboard

| Component | Status | File |
|-----------|--------|------|
| Multi-select dialog | ✅ | `dashboard/src/components/operateur/AssignKoperativesDialog.tsx` |
| AG Grid column | ✅ | `dashboard/src/pages/OperateurManagementPage.tsx` |
| API call + hook | ✅ | `dashboard/src/api/operateur.api.ts`, `dashboard/src/hooks/operateur.hook.ts` |

### Frontend (what exists today)

- `UserOperator` model at `front/src/models/UserOperator.ts` has `assignedKoperatives?: Koperative[]` (the relational list to use).
- `VoyagePage.tsx` uses `useKoperativePageStore` (`koperativeForm`, `setSelectedId`, `setKoperativeForm`) to hold the **active** koperative.
- For GUICHET users there is a `useEffect` that auto-fills the store from `user.koperative` (single relation) — this must be replaced to use `user.assignedKoperatives` instead.
- `VoyageFormDrawer` receives `koperativeId` as a prop and uses it to filter crafters and chauffeurs.
- There is **no koperative selector** shown to the user in the voyage management form today.

---

## What Still Needs To Be Built

### Front — Koperative Selection on Voyage Form

**Acceptance criteria**

1. When an OPERATOR or GUICHET user with **exactly one** assigned koperative enters the voyage management flow, the koperative is set automatically in the store (no UI shown).
2. When an OPERATOR or GUICHET user with **more than one** assigned koperative enters the voyage management flow, a selector is shown (inline or dialog) that lets them choose one koperative before the form is fully usable.
3. The selected koperative is stored in `useKoperativePageStore` (`koperativeForm` + `selectedId`) so all existing consumers (`voyageFilter`, `prefilledVoyageData`, `VoyageFormDrawer.koperativeId`, etc.) continue to work without further changes.
4. Switching koperative resets the voyage list / form state as needed (same as a public user changing koperative via `KoperativeAutocomplete`).

**Key files to read / touch**

- [`front/src/pages/VoyagePage.tsx`](../front/src/pages/VoyagePage.tsx) — host page; GUICHET auto-select `useEffect` lives here; add OPERATOR equivalent and selector UI
- [`front/src/stores/koperative.store.ts`](../front/src/stores/koperative.store.ts) — Zustand store holding `koperativeForm` / `selectedId`
- [`front/src/models/UserOperator.ts`](../front/src/models/UserOperator.ts) — `assignedKoperatives?: Koperative[]`
- [`front/src/utils/auth.utils.ts`](../front/src/utils/auth.utils.ts) — `isGuichetUser`, `isKoperativeUser` helpers; add `isOperatorUser` if missing
- [`front/src/components/voyage/VoyageFormDrawer.tsx`](../front/src/components/voyage/VoyageFormDrawer.tsx) — receives `koperativeId` prop; no change needed unless selector lives inside drawer
- [`front/src/components/shared/KoperativeAutocomplete.tsx`](../front/src/components/shared/KoperativeAutocomplete.tsx) — reusable koperative picker; consider reusing for the selector

**Suggested approach — keep it concise**

Replace the existing GUICHET-only `useEffect` with a single unified effect that reads `user.assignedKoperatives`. Always default to the first koperative; show the selector so the user can switch when there are more than one:

```tsx
useEffect(() => {
  if (koperativeForm?.id)
    return;
  if(user?.assignedKoperatives?.length)
  {
    setSelectedId(user.assignedKoperatives[0].id);
    setKoperativeForm(user.assignedKoperatives[0]);
  }
}, [user?.assignedKoperatives, koperativeForm?.id, setSelectedId, setKoperativeForm]);
```

For the multi-koperative selector, render a compact inline component scoped to `user.assignedKoperatives` options, shown only when `(user?.assignedKoperatives?.length ?? 0) > 1`.

> Prefer concise implementation: avoid intermediate variables, helper functions, or wrappers that are only called once.

---

## Implementation Checklist

- [ ] Replace the GUICHET-only `useEffect` in `VoyagePage.tsx` with a single effect reading `user.assignedKoperatives` (covers both OPERATOR and GUICHET)
- [ ] Remove any code that reads from `user.koperative` (single relation) for koperative auto-selection
- [ ] Add a koperative selector for the multi-koperative case scoped to `user.assignedKoperatives` (reuse `KoperativeAutocomplete` or a plain MUI `Select`)
- [ ] **Remove the `koperative` single relation from GUICHET**: drop `koperative` from `GuichetEntity` (backend), its DTO/model, and any frontend code that reads `user.koperative` on a GUICHET user — it is replaced by `assignedKoperatives`
- [ ] Run `cd front && npm run format` after all frontend changes
- Keep code minimal: no unnecessary abstractions, helpers, or intermediate variables

---

## Architectural Rules (do not break)

- Koperative selection state lives in `useKoperativePageStore` (Zustand, UI state only — not React Query)
- All voyage API calls already read `koperativeForm.id` from the store via `voyageFilter`; do not duplicate state
- Do not create a new axios instance; reuse `axios.ts`
- Use MUI `sx` prop, no inline styles
- Follow the positive-condition / early-return pattern from `copilot-instructions.md`

---

## Reference

- [copilot-instructions.md](../copilot-instructions.md) — architecture rules, data-flow matrix
- [zustand.prompt.md](zustand.prompt.md) — Zustand patterns
- [dashboard.prompt.md](dashboard.prompt.md) — dashboard conventions (for any follow-up dashboard work)

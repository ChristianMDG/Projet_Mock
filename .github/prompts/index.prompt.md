---
agent: agent
---

# 📚 AI Development Prompts Index - Taxibrousse
**Note:** This index references current tools and versions. If a prompt mentions deprecated APIs, consult the corresponding specialized prompt for updated guidance.

## 🤖 Agent Instructions

- Keep answers minimal and skimmable; include only essential snippets
- Link to specialized prompts instead of duplicating guidance
- Reuse repository utilities and patterns; don't re-implement
- Prefer security-safe examples (no secrets, use VITE_* on frontend)

## 🎯 Project Architecture

**3-tier taxi-brousse reservation system**:
- **Backend**: Spring Boot 3.4 (Java 21) + Interface-based controllers - `/src/main/java/mg/taxibrousse/`
- **Frontend**: React 19 + Vite 6 + MUI v7 - `/front/`  
- **CMS**: Strapi 5.23.6 + Dynamic Pages - `/cms/`

## 📋 Prompt Selection Guide

| Task | Primary Prompt | Supporting |
|------|----------------|------------|
| **New Feature** | `dev.prompt.md` | `context`, specialized |
| **UI Component** | `mui.prompt.md` | `formik`, `label` |
| **Form Creation** | `formik.prompt.md` | `label`, `mui` |
| **API Integration** | `reactquery.prompt.md` | `zustand` |
| **State Management** | `zustand.prompt.md` | `reactquery` |
| **Translation** | `label.prompt.md` | - |
| **CMS Content** | `strapi.prompt.md` | `cloudinary`, `label` |
| **Dynamic Sections** | `README-DYNAMIC-PAGES.md` | `strapi`, `mui` |
| **Media Upload** | `cloudinary.prompt.md` | `strapi`, `formik` |
| **Documentation** | `readme.prompt.md` | - |

## 📁 Available Prompts

### Core Development
| File | Purpose |
|------|---------|
| `dev.prompt.md` | Complete development workflow |
| `mui.prompt.md` | Material UI v7 patterns |
| `formik.prompt.md` | Form handling + Yup validation |

### State & Data
| File | Purpose |
|------|---------|
| `zustand.prompt.md` | Client state management |
| `reactquery.prompt.md` | Server state + caching |

### CMS & Media
| File | Purpose |
|------|---------|
| `strapi.prompt.md` | Strapi CMS development |
| `cloudinary.prompt.md` | Media management |

### i18n & Docs
| File | Purpose |
|------|---------|
| `label.prompt.md` | Translation key management |
| `readme.prompt.md` | Documentation maintenance |

### Instructions
| File | Purpose |
|------|---------|
| `README-DYNAMIC-PAGES.md` | Dynamic sections system |
| `mui.md` | MUI quick reference |

## 🚀 Quick Start by Task

### Adding a New Feature
1. Read `dev.prompt.md` for workflow
2. Decide layer: Backend vs CMS vs Frontend
3. Follow specialized prompts as needed

### Adding a Dynamic Section
1. Read `/.github/instructions/README-DYNAMIC-PAGES.md`
2. Create CMS component (`cms/src/components/page/`)
3. Create React component (`front/src/components/section/`)
4. Register in `Section.tsx`

### Adding Translations
1. Read `label.prompt.md`
2. Add key to `front/src/labelKeys.json`
3. Add translations to `src/main/resources/resources.json`

### Working with CMS
1. Read `strapi.prompt.md`
2. For media: also read `cloudinary.prompt.md`
3. For dynamic pages: read `README-DYNAMIC-PAGES.md`

## 🔄 Prompt Maintenance

### When to Update
- New architectural patterns introduced
- Major library upgrades
- Common patterns emerge

### Update Process
1. Update specialized prompts first
2. Update general prompts to reference them
3. Update this index if new prompts added
4. Test with actual development tasks

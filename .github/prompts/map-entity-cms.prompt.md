# Entity to CMS Strapi Mapping Guide - Taxibrousse

**Note:** This guide maps JPA entities to Strapi content types. Avoid legacy Strapi patterns and always verify field types and relations match the current Strapi schema format (v5+). Keep data-sensitive entities in backend only.

## Agent Instructions

- Use **interface-based controller pattern** for backend
- Keep code minimal with positive conditions and early returns
- Use current tech stack: **Spring Boot 3.4**, **Java 21**, **Strapi 5.23.6**
- Follow data flow decision matrix: transactional → Backend, content → CMS
- Import from `@/` for clean module resolution

Cette prompt aide à mapper une entité JPA Spring Boot vers un content type Strapi CMS.

---

## 1. Backend Entity (Spring Boot 3.4 + Java 21)

### Example: `VilleEntity.java`

```java
package mg.taxibrousse.entities;

import jakarta.persistence.*;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity(name = "Ville")
@Table(name = "Ville", indexes = {
    @Index(name = "ville_created_by_id_fk", columnList = "created_by_id"),
    @Index(name = "ville_updated_by_id_fk", columnList = "updated_by_id"),
    @Index(name = "ville_documents_idx", columnList = "document_id, locale, published_at")
})
@NoArgsConstructor
public class VilleEntity extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String region;

    @Column(length = 100)
    private String province;

    @Column(length = 8)
    private String code;

    @Column
    private Boolean isActive = true;

    @Column(length = 8)
    private String rn;

    @OneToMany(mappedBy = "ville")
    private List<FokotanyEntity> fokotanies;
}
```

### Interface-Based Controller Pattern

**Controller Interface**:
```java
@RestController
@RequestMapping("/api/villes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IVilleController {
    
    @GetMapping
    ResponseEntity<List<VilleDto>> getAllVilles();
    
    @GetMapping("/active")
    ResponseEntity<List<VilleDto>> getActiveVilles();
}
```

**Controller Implementation**:
```java
@RestController
@RequiredArgsConstructor
public class VilleController implements IVilleController {
    private final VilleService villeService;
    
    @Override
    public ResponseEntity<List<VilleDto>> getAllVilles() {
        return ResponseEntity.ok(villeService.findAll());
    }
    
    @Override 
    public ResponseEntity<List<VilleDto>> getActiveVilles() {
        return ResponseEntity.ok(villeService.findByIsActiveTrue());
    }
}
```

---

## 2. CMS Strapi Schema (v5.23.6)

### Path: `cms/src/api/{entity-name}/content-types/{entity-name}/schema.json`

### Example: `cms/src/api/ville/content-types/ville/schema.json`

```json
{
  "kind": "collectionType",
  "collectionName": "ville",
  "info": {
    "singularName": "ville",
    "pluralName": "villes",
    "displayName": "Ville"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "maxLength": 100
    },
    "region": {
      "type": "string",
      "maxLength": 100
    },
    "province": {
      "type": "string",
      "maxLength": 100
    },
    "code": {
      "type": "string",
      "maxLength": 8
    },
    "isActive": {
      "type": "boolean",
      "default": true
    },
    "rn": {
      "type": "string",
      "maxLength": 8
    },
    "fokotanies": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::fokotany.fokotany",
      "mappedBy": "ville"
    }
  }
}
```

---

## 3. Mutation File (Seed Data)

### Path: `cms/{entity-plural}/{entity-plural}.mutation.json`

### Example: `cms/villes/villes.mutation.json`

```json
{
  "description": "All cities/villes in Madagascar for taxi-brousse routes",
  "collection": "api::ville.ville",
  "data": [
    { 
      "name": "Antananarivo", 
      "code": "TAN", 
      "province": "Antananarivo", 
      "region": "ANALAMANGA", 
      "rn": "RN2", 
      "isActive": true 
    },
    { 
      "name": "Toamasina", 
      "code": "TOA", 
      "province": "Toamasina", 
      "region": "ATSINANANA", 
      "rn": "RN2", 
      "isActive": true 
    }
  ]
}
```

---

## 4. Type Mapping Reference

| Java (JPA)             | Strapi Type        | Notes                                      |
|------------------------|--------------------|--------------------------------------------|
| `String`               | `string`           | Add `maxLength` if `@Column(length=X)`     |
| `Boolean`              | `boolean`          | Add `default` if entity has default value  |
| `Integer`, `Long`      | `integer`          | Use `biginteger` for very large numbers    |
| `Double`, `Float`      | `decimal`          |                                            |
| `BigDecimal`           | `decimal`          |                                            |
| `LocalDate`            | `date`             |                                            |
| `LocalDateTime`        | `datetime`         |                                            |
| `@Lob String`          | `richtext` / `text`| Use `richtext` for HTML, `text` for plain  |
| `@Enumerated`          | `enumeration`      | Define `enum` array in schema              |
| `@ManyToOne`           | `relation`         | `relation: "manyToOne"`                    |
| `@OneToMany`           | `relation`         | `relation: "oneToMany"`, use `mappedBy`    |
| `@OneToOne`            | `relation`         | `relation: "oneToOne"`                     |
| `@ManyToMany`          | `relation`         | `relation: "manyToMany"`                   |

---

## 5. Relation Mapping

### ManyToOne (Child side)

**Java:**
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(nullable = false)
private VilleEntity ville;
```

**Strapi:**
```json
"ville": {
  "type": "relation",
  "relation": "manyToOne",
  "target": "api::ville.ville",
  "inversedBy": "fokotanies"
}
```

### OneToMany (Parent side)

**Java:**
```java
@OneToMany(mappedBy = "ville")
private List<FokotanyEntity> fokotanies;
```

**Strapi:**
```json
"fokotanies": {
  "type": "relation",
  "relation": "oneToMany",
  "target": "api::fokotany.fokotany",
  "mappedBy": "ville"
}
```

---

## 6. Admin Translations

Add translations in `cms/src/admin/app.tsx`:

### French (fr)
```typescript
// Ville
'content-manager.content-types.api::ville.ville.name': 'Nom',
'content-manager.content-types.api::ville.ville.region': 'Région',
'content-manager.content-types.api::ville.ville.province': 'Province',
'content-manager.content-types.api::ville.ville.code': 'Code',
'content-manager.content-types.api::ville.ville.isActive': 'Actif',
'content-manager.content-types.api::ville.ville.rn': 'Route Nationale',
'content-manager.content-types.api::ville.ville.fokotanies': 'Fokotany',
```

### English (en)
```typescript
// Ville
'content-manager.content-types.api::ville.ville.name': 'Name',
'content-manager.content-types.api::ville.ville.region': 'Region',
'content-manager.content-types.api::ville.ville.province': 'Province',
'content-manager.content-types.api::ville.ville.code': 'Code',
'content-manager.content-types.api::ville.ville.isActive': 'Active',
'content-manager.content-types.api::ville.ville.rn': 'National Road',
'content-manager.content-types.api::ville.ville.fokotanies': 'Fokotanies',
```

### Translation Key Pattern
```
content-manager.content-types.api::{singularName}.{singularName}.{attributeName}
```

---

## 7. Required Constraints Mapping

| JPA Annotation                    | Strapi Attribute      |
|-----------------------------------|-----------------------|
| `@Column(nullable = false)`       | `"required": true`    |
| `@Column(length = X)`             | `"maxLength": X`      |
| `@Column(unique = true)`          | `"unique": true`      |
| Default value in entity field     | `"default": value`    |

---

## 8. Required Indexes for Strapi CMS Sync

Every entity that syncs with Strapi CMS **MUST** include these standard indexes for proper CMS integration:

### Standard Index Pattern

```java
@Table(name = "{table_name}", indexes = {
    @Index(name = "{entity}_created_by_id_fk", columnList = "created_by_id"),
    @Index(name = "{entity}_updated_by_id_fk", columnList = "updated_by_id"),
    @Index(name = "{entity}_documents_idx", columnList = "document_id, locale, published_at")
})
```

### Additional Indexes

Add indexes for:
- **Unique fields**: `@Index(name = "{entity}_{field}_idx", columnList = "{field}")`
- **Foreign keys**: `@Index(name = "{entity}_{relation}_id_fk", columnList = "{relation}_id")`
- **Frequently queried fields**: Fields used in WHERE clauses or JOINs

### Complete Example: ResourceEntity

```java
@Entity(name = "Resource")
@Table(name = "resource", indexes = {
    @Index(name = "resource_created_by_id_fk", columnList = "created_by_id"),
    @Index(name = "resource_updated_by_id_fk", columnList = "updated_by_id"),
    @Index(name = "resource_documents_idx", columnList = "document_id, locale, published_at"),
    @Index(name = "resource_key_idx", columnList = "key")
})
public class ResourceEntity extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String key;

    @Column(nullable = false)
    private String fr;

    @Column(nullable = false)
    private String en;

    @Column(nullable = false)
    private String mg;
}
```

### Index Naming Convention

| Index Type          | Naming Pattern                              |
|---------------------|---------------------------------------------|
| Created by FK       | `{entity}_created_by_id_fk`                 |
| Updated by FK       | `{entity}_updated_by_id_fk`                 |
| Documents composite | `{entity}_documents_idx`                    |
| Unique field        | `{entity}_{field}_idx`                      |
| Foreign key         | `{entity}_{relation}_id_fk`                 |

---

## 9. Checklist for New Entity Mapping

- [ ] Add required indexes to JPA entity (`@Table(indexes = {...})`)
- [ ] Create Strapi content type schema at `cms/src/api/{entity}/content-types/{entity}/schema.json`
- [ ] Map all entity fields with correct types
- [ ] Configure relations with `inversedBy` / `mappedBy`
- [ ] Create mutation file at `cms/content/{entities}.mutation.json`
- [ ] Add French translations in `app.tsx` under `fr:`
- [ ] Add English translations in `app.tsx` under `en:`
- [ ] Create routes file at `cms/src/api/{entity}/routes/{entity}.ts` (if custom routes needed)
- [ ] Test content type in Strapi admin

---

## 10. Complete Example: Fokotany

### Backend Entity
```java
@Entity(name = "Fokotany")
@Table(name = "fokotany")
public class FokotanyEntity extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String commune;

    @Column(nullable = false, length = 100)
    private String fokontany;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private VilleEntity ville;
}
```

### CMS Schema
```json
{
  "kind": "collectionType",
  "collectionName": "fokotany",
  "info": {
    "singularName": "fokotany",
    "pluralName": "fokotanies",
    "displayName": "Fokotany"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "commune": {
      "type": "string",
      "required": true,
      "maxLength": 100
    },
    "fokontany": {
      "type": "string",
      "required": true,
      "maxLength": 100
    },
    "ville": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::ville.ville",
      "inversedBy": "fokotanies"
    }
  }
}
```

### Translations
```typescript
// French
'content-manager.content-types.api::fokotany.fokotany.commune': 'Commune',
'content-manager.content-types.api::fokotany.fokotany.fokontany': 'Fokontany',
'content-manager.content-types.api::fokotany.fokotany.ville': 'Ville',

// English
'content-manager.content-types.api::fokotany.fokotany.commune': 'Commune',
'content-manager.content-types.api::fokotany.fokotany.fokontany': 'Fokontany',
'content-manager.content-types.api::fokotany.fokotany.ville': 'City',
```

---

## 11. Usage

When asked to map an entity:

1. **Add indexes** to JPA entity for CMS sync fields
2. **Analyze** the JPA entity structure
3. **Create** the Strapi schema with matching attributes
4. **Configure** relations properly (bidirectional if needed)
5. **Generate** mutation file with seed data if provided
6. **Add** translations for both FR and EN in `app.tsx`

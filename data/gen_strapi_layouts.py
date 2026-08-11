#!/usr/bin/env python3
"""
Generates Strapi content manager layout SQL.
All edit fields are full-width (size 12). mainField = first representative field.
"""
import json, os, glob, sys

CMS_ROOT = "/Users/ofanomezantsoa/IdeaProjects/Taxibrousse/cms/src/api"

# System fields to exclude from layouts
SKIP = {"id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale",
        "createdBy", "updatedBy", "localizations"}

# Field types that cannot be in list view (too complex)
NO_LIST = {"richtext", "json", "dynamiczone", "blocks"}

# Relations that we show in edit but not list
RELATION_SIZE = 12

# Per-content-type overrides: which field is the "main" representative
MAIN_FIELD_OVERRIDE = {
    "api::gare.gare": "name",
    "api::partenaire.partenaire": "name",
    "api::hotel.hotel": "name",
    "api::route.route": "name",
    "api::route-stop.route-stop": "stopOrder",
    "api::voyage.voyage": "departureTime",
    "api::crafter.crafter": "registrationNumber",
    "api::moto.moto": "registrationNumber",
    "api::chauffeur.chauffeur": "licenseNumber",
    "api::reservation.reservation": "bookingReference",
    "api::seat.seat": "seatNumber",
    "api::facturation.facturation": "invoiceNumber",
    "api::colis.colis": "senderName",
    "api::contrat.contrat": "title",
    "api::guichet.guichet": "name",
    "api::koperative.koperative": "name",
    "api::ville.ville": "name",
    "api::classe.classe": "name",
    "api::fokotany.fokotany": "name",
    "api::dynamic-page.dynamic-page": "title",
    "api::hero-content.hero-content": "title",
    "api::gare-banner.gare-banner": "title",
    "api::koperative-banner.koperative-banner": "title",
    "api::promotion-banner.promotion-banner": "title",
    "api::payment-method.payment-method": "name",
    "api::payment-transaction.payment-transaction": "reference",
    "api::resource.resource": "name",
    "api::ville-detail.ville-detail": "title",
}

# Human-readable labels for camelCase fields
def to_label(name):
    import re
    s = re.sub(r'([A-Z])', r' \1', name).strip()
    return s[0].upper() + s[1:] if s else name

def infer_main_field(uid, attrs):
    if uid in MAIN_FIELD_OVERRIDE:
        candidate = MAIN_FIELD_OVERRIDE[uid]
        if candidate in attrs:
            return candidate
    # fallback priority
    for candidate in ["name", "title", "reference", "registrationNumber", "licenseNumber",
                       "invoiceNumber", "bookingReference", "senderName", "stopOrder",
                       "departureTime", "seatNumber"]:
        if candidate in attrs:
            return candidate
    # first non-relation string field
    for k, v in attrs.items():
        if k in SKIP:
            continue
        if v.get("type") in ("string", "text", "integer", "decimal", "datetime") and v.get("type") != "relation":
            return k
    return "id"

def build_config(schema_path):
    with open(schema_path) as f:
        schema = json.load(f)

    info = schema.get("info", {})
    singular = info.get("singularName", "")
    plural = info.get("pluralName", "")
    display = info.get("displayName", singular)

    # Derive UID from path
    # .../cms/src/api/{slug}/content-types/{slug}/schema.json
    parts = schema_path.split(os.sep)
    api_slug = parts[-4]
    uid = f"api::{api_slug}.{singular}"

    attrs = schema.get("attributes", {})

    # Build edit layout: pair fields 50/50 (size 6 each per row)
    # Full-width (size 12) for: richtext, text, json, dynamiczone, blocks, component, boolean
    FULL_WIDTH_TYPES = {"richtext", "text", "json", "dynamiczone", "blocks", "component"}

    def field_size(attr):
        return 12 if attr.get("type") in FULL_WIDTH_TYPES else 6

    edit_rows = []
    pending = None  # holds a half-row field waiting to be paired

    def flush_pending():
        nonlocal pending
        if pending:
            edit_rows.append([pending])
            pending = None

    # Non-relation fields first
    for name, attr in attrs.items():
        if name in SKIP:
            continue
        atype = attr.get("type")
        if atype in ("relation", "component"):
            continue
        size = field_size(attr)
        if size == 12:
            flush_pending()
            edit_rows.append([{"name": name, "size": 12}])
        else:
            if pending:
                edit_rows.append([pending, {"name": name, "size": 6}])
                pending = None
            else:
                pending = {"name": name, "size": 6}
    flush_pending()

    # Relation fields after — each gets a full row
    for name, attr in attrs.items():
        if name in SKIP:
            continue
        if attr.get("type") != "relation":
            continue
        edit_rows.append([{"name": name, "size": 12}])

    # Build list layout: first 4 non-complex, non-relation fields
    list_fields = ["id"]
    main_field = infer_main_field(uid, attrs)
    if main_field != "id":
        list_fields.append(main_field)
    for name, attr in attrs.items():
        if name in SKIP or name == main_field:
            continue
        atype = attr.get("type")
        if atype in NO_LIST or atype == "relation" or atype == "component":
            continue
        list_fields.append(name)
        if len(list_fields) >= 5:
            break

    # Build metadatas
    meta = {
        "id": {
            "edit": {},
            "list": {"label": "ID", "searchable": False, "sortable": False}
        },
        "documentId": {
            "edit": {},
            "list": {"label": "Document ID", "searchable": True, "sortable": True}
        }
    }
    for name, attr in attrs.items():
        if name in SKIP:
            continue
        atype = attr.get("type", "")
        label = to_label(name)
        is_sortable = atype not in ("relation", "richtext", "json", "component", "dynamiczone", "blocks")
        is_searchable = atype in ("string", "text", "richtext", "email", "uid", "enumeration")
        meta[name] = {
            "edit": {
                "label": label,
                "description": "",
                "placeholder": "",
                "visible": True,
                "editable": True
            },
            "list": {
                "label": label,
                "searchable": is_searchable,
                "sortable": is_sortable
            }
        }

    config = {
        "settings": {
            "bulkable": True,
            "filterable": True,
            "searchable": True,
            "pageSize": 25,
            "mainField": main_field,
            "defaultSortBy": main_field if main_field != "id" else "id",
            "defaultSortOrder": "ASC"
        },
        "metadatas": meta,
        "layouts": {
            "edit": edit_rows,
            "list": list_fields
        },
        "uid": uid
    }

    return uid, config

def main():
    schemas = sorted(glob.glob(f"{CMS_ROOT}/*/content-types/*/schema.json"))
    sql_parts = []

    for path in schemas:
        try:
            uid, config = build_config(path)
        except Exception as e:
            print(f"-- SKIP {path}: {e}", file=sys.stderr)
            continue

        key = f"plugin_content_manager_configuration_content_types::{uid}"
        value = json.dumps(config).replace("'", "''")

        sql_parts.append(
            f"DO $$ BEGIN\n"
            f"  IF EXISTS (SELECT 1 FROM strapi_core_store_settings WHERE key = '{key}') THEN\n"
            f"    UPDATE strapi_core_store_settings SET value = '{value}' WHERE key = '{key}';\n"
            f"  ELSE\n"
            f"    INSERT INTO strapi_core_store_settings (key, value, \"type\", environment, tag)\n"
            f"    VALUES ('{key}', '{value}', 'object', '', 'content-manager');\n"
            f"  END IF;\n"
            f"END $$;\n"
        )

    print("BEGIN;")
    for s in sql_parts:
        print(s)
    print("COMMIT;")
    print(f"-- {len(sql_parts)} content types configured", file=sys.stderr)

if __name__ == "__main__":
    main()

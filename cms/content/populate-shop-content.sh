#!/usr/bin/env bash

# =============================================================================
# Taxibrousse Shop Content - Populate Script
#
# Seeds the shop-related content types in dependency order:
#   1. categories              (collection – categories.mutation.json, top-level)
#   2. product-categories      (collection – subcategories.mutation.json,
#                               each entry resolves category.slug → top Category)
#   3. sellers                 (collection – sellers.mutation.json)
#   4. products                (collection, depends on categories via categorySlug
#                               and sellers via sellerSlug – malagasy-products.mutation.json)
#   5. voyage-product-bundles  (collection, depends on products via productSlugs)
#   6. koperative-partners     (collection)
#   7. shop-banner             (single type)
#   8. featured-products       (dynamic-zone section on page-template, depends on products)
#   9. shop-configuration      (single type, legacy)
#  10. promotion-banner        (single type, legacy)
#
# Reuses the curl + jq + STRAPI_API_TOKEN pattern from the other
# cms/content/*.sh populate scripts (see populate-all-banners.sh and
# populate-all-sections.sh).
#
# Usage:
#   STRAPI_API_TOKEN=your_token ./populate-shop-content.sh
# =============================================================================

set -euo pipefail
set -o errtrace
trap 'log_fail "populate-shop-content.sh aborted at line $LINENO"' ERR

STRAPI_URL="${STRAPI_URL:-http://localhost:1337}"
STRAPI_API_TOKEN="${STRAPI_API_TOKEN:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAGE_SLUG="${PAGE_SLUG:-page-template}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_step()    { echo -e "${YELLOW}▶ $1${NC}"; }
log_ok()      { echo -e "${GREEN}[OK]${NC} $1"; }
log_fail()    { echo -e "${RED}[FAIL]${NC} $1"; }

# ---- Pre-flight checks ------------------------------------------------------
if ! command -v jq &>/dev/null; then
  log_fail "jq is required. Install with: brew install jq"
  exit 1
fi

if ! command -v curl &>/dev/null; then
  log_fail "curl is required."
  exit 1
fi

if [ -z "$STRAPI_API_TOKEN" ]; then
  log_fail "STRAPI_API_TOKEN environment variable is required."
  echo "Usage: STRAPI_API_TOKEN=your_token ./populate-shop-content.sh"
  exit 1
fi

AUTH_HEADER="Authorization: Bearer ${STRAPI_API_TOKEN}"
JSON_HEADER="Content-Type: application/json"

echo ""
echo "=========================================="
echo "  Populate Shop Content"
echo "  Strapi: $STRAPI_URL"
echo "=========================================="
echo ""

# ---- Helpers ---------------------------------------------------------------

# Extract Strapi error message (empty if none).
_extract_error() {
  echo "$1" | jq -r '.error.message // empty'
}

# Load a collection-format mutation file (data:[...] with locale/localizations)
# into a Strapi collection endpoint. Creates the default locale entry first,
# then PUTs each localization onto the returned documentId.
#
#   $1 = mutation file path
#   $2 = API plural path segment (e.g. "product-categories", "products")
#   $3 = optional jq filter applied to each entry BEFORE POST (to strip helper
#        fields and/or resolve relations). Receives the raw entry on stdin.
load_collection_mutation() {
  local file="$1"
  local api_path="$2"
  local transform="${3:-.}"

  local collection entries_count idx
  collection=$(jq -r '.collection // "unknown"' "$file")
  entries_count=$(jq '.data | length' "$file")
  log_info "  collection=$collection  entries=$entries_count  endpoint=/api/${api_path}"

  for idx in $(seq 0 $((entries_count - 1))); do
    local raw entry locale localizations slug name payload response err doc_id

    raw=$(jq ".data[$idx]" "$file")
    locale=$(echo "$raw" | jq -r '.locale // "fr"')
    localizations=$(echo "$raw" | jq '.localizations // {}')
    slug=$(echo "$raw" | jq -r '.slug // empty')
    name=$(echo "$raw" | jq -r '.name // .Title // .title // .sku // "(no label)"')

    # Strip helper fields then apply caller transform.
    entry=$(echo "$raw" | jq 'del(.locale, .localizations)' | jq "$transform")

    # Check for existing entry by slug when available.
    doc_id=""
    if [ -n "$slug" ]; then
      local existing
      existing=$(curl -sS -G "${STRAPI_URL}/api/${api_path}" \
        --data-urlencode "filters[slug][\$eq]=${slug}" \
        --data-urlencode "locale=${locale}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER")
      doc_id=$(echo "$existing" | jq -r '.data[0].documentId // empty')
    fi

    payload=$(jq -n --argjson data "$entry" '{data: $data}')

    if [ -z "$doc_id" ] || [ "$doc_id" = "null" ]; then
      response=$(curl -sS -X POST "${STRAPI_URL}/api/${api_path}?locale=${locale}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
    else
      response=$(curl -sS -X PUT "${STRAPI_URL}/api/${api_path}/${doc_id}?locale=${locale}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
    fi

    err=$(_extract_error "$response")
    if [ -n "$err" ]; then
      log_fail "  $name ($locale): $err"
      return 1
    fi

    doc_id=$(echo "$response" | jq -r '.data.documentId // empty')
    if [ -z "$doc_id" ] || [ "$doc_id" = "null" ]; then
      log_fail "  $name ($locale): no documentId returned"
      echo "$response" | jq '.' >&2
      return 1
    fi

    # Push localizations (merge base entry so non-localized required fields are present)
    local loc loc_data loc_payload loc_response loc_err
    for loc in $(echo "$localizations" | jq -r 'keys[]?'); do
      loc_data=$(echo "$localizations" | jq ".\"$loc\"")
      loc_data=$(jq -n --argjson base "$entry" --argjson loc "$loc_data" '$base * $loc')
      loc_payload=$(jq -n --argjson data "$loc_data" '{data: $data}')
      loc_response=$(curl -sS -X PUT "${STRAPI_URL}/api/${api_path}/${doc_id}?locale=${loc}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$loc_payload")
      loc_err=$(_extract_error "$loc_response")
      if [ -n "$loc_err" ]; then
        log_fail "  $name localization [$loc]: $loc_err"
        return 1
      fi
    done
    echo "    • $name → $doc_id"
  done
}

# Load a single-type mutation file (data:[{...}] with locale/localizations).
#   $1 = mutation file
#   $2 = API single-type path segment (e.g. "shop-configuration", "promotion-banner")
load_single_type_mutation() {
  local file="$1"
  local api_path="$2"

  local raw locale localizations entry payload response err
  raw=$(jq '.data[0]' "$file")
  locale=$(echo "$raw" | jq -r '.locale // "fr"')
  localizations=$(echo "$raw" | jq '.localizations // {}')
  entry=$(echo "$raw" | jq 'del(.locale, .localizations)')

  payload=$(jq -n --argjson data "$entry" '{data: $data}')
  response=$(curl -sS -X PUT "${STRAPI_URL}/api/${api_path}?locale=${locale}" \
    -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
  err=$(_extract_error "$response")
  if [ -n "$err" ]; then
    log_fail "  single-type /${api_path} ($locale): $err"
    return 1
  fi
  echo "    • /api/${api_path} [$locale] updated"

  local loc loc_data loc_payload loc_response loc_err
  for loc in $(echo "$localizations" | jq -r 'keys[]?'); do
    loc_data=$(echo "$localizations" | jq ".\"$loc\"")
    loc_data=$(jq -n --argjson base "$entry" --argjson loc "$loc_data" '$base * $loc')
    loc_payload=$(jq -n --argjson data "$loc_data" '{data: $data}')
    loc_response=$(curl -sS -X PUT "${STRAPI_URL}/api/${api_path}?locale=${loc}" \
      -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$loc_payload")
    loc_err=$(_extract_error "$loc_response")
    if [ -n "$loc_err" ]; then
      log_fail "  single-type /${api_path} [$loc]: $loc_err"
      return 1
    fi
    echo "    • /api/${api_path} [$loc] updated"
  done
}

# Same as load_single_type_mutation but applies an extra jq transform to both
# the default-locale entry and each localization payload (e.g. to strip helper
# URL fields before hitting Strapi).
load_single_type_with_transform() {
  local file="$1"
  local api_path="$2"
  local transform="${3:-.}"

  local raw locale localizations entry payload response err
  raw=$(jq '.data[0]' "$file")
  locale=$(echo "$raw" | jq -r '.locale // "fr"')
  localizations=$(echo "$raw" | jq '.localizations // {}')
  entry=$(echo "$raw" | jq 'del(.locale, .localizations)' | jq "$transform")

  payload=$(jq -n --argjson data "$entry" '{data: $data}')
  response=$(curl -sS -X PUT "${STRAPI_URL}/api/${api_path}?locale=${locale}" \
    -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
  err=$(_extract_error "$response")
  if [ -n "$err" ]; then
    log_fail "  single-type /${api_path} ($locale): $err"
    echo "$response" | jq -r '.error.details.errors[]? | "    - \(.path|join(".")): \(.message)"' >&2 || true
    return 1
  fi
  echo "    • /api/${api_path} [$locale] updated"

  local loc loc_data loc_payload loc_response loc_err
  for loc in $(echo "$localizations" | jq -r 'keys[]?'); do
    loc_data=$(echo "$localizations" | jq ".\"$loc\"" | jq "$transform")
    loc_data=$(jq -n --argjson base "$entry" --argjson loc "$loc_data" '$base * $loc')
    loc_payload=$(jq -n --argjson data "$loc_data" '{data: $data}')
    loc_response=$(curl -sS -X PUT "${STRAPI_URL}/api/${api_path}?locale=${loc}" \
      -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$loc_payload")
    loc_err=$(_extract_error "$loc_response")
    if [ -n "$loc_err" ]; then
      log_fail "  single-type /${api_path} [$loc]: $loc_err"
      return 1
    fi
    echo "    • /api/${api_path} [$loc] updated"
  done
}

# Resolve a product slug to its documentId (via /api/products?filters[slug][$eq]=...).
resolve_product_id() {
  local slug="$1"
  local response
  response=$(curl -sS -G "${STRAPI_URL}/api/products" \
    --data-urlencode "filters[slug][\$eq]=${slug}" \
    --data-urlencode "locale=fr" \
    -H "$AUTH_HEADER" -H "$JSON_HEADER")
  echo "$response" | jq -r '.data[0].documentId // empty'
}

# Resolve a top-level category slug to its documentId.
resolve_top_category_id() {
  local slug="$1"
  local response
  response=$(curl -sS -G "${STRAPI_URL}/api/categories" \
    --data-urlencode "filters[slug][\$eq]=${slug}" \
    --data-urlencode "locale=fr" \
    -H "$AUTH_HEADER" -H "$JSON_HEADER")
  echo "$response" | jq -r '.data[0].documentId // empty'
}

# Resolve a product-category slug to its documentId.
resolve_category_id() {
  local slug="$1"
  local response
  response=$(curl -sS -G "${STRAPI_URL}/api/product-categories" \
    --data-urlencode "filters[slug][\$eq]=${slug}" \
    --data-urlencode "locale=fr" \
    -H "$AUTH_HEADER" -H "$JSON_HEADER")
  echo "$response" | jq -r '.data[0].documentId // empty'
}

# Resolve a seller slug to its documentId.
resolve_seller_id() {
  local slug="$1"
  local response
  response=$(curl -sS -G "${STRAPI_URL}/api/sellers" \
    --data-urlencode "filters[slug][\$eq]=${slug}" \
    --data-urlencode "locale=fr" \
    -H "$AUTH_HEADER" -H "$JSON_HEADER")
  echo "$response" | jq -r '.data[0].documentId // empty'
}

# Inject the featured-products section onto the page-template dynamic zone for
# each locale. Resolves productSlugs → product documentIds and replaces any
# existing page.featured-products section (keeps other sections intact).
load_featured_products_section() {
  local file="$1"

  local slug product_slugs
  slug=$(jq -r '.slug' "$file")
  product_slugs=$(jq -r '.productSlugs[]?' "$file")

  # Resolve product slugs → documentIds
  local ids_json="[]"
  local s pid
  for s in $product_slugs; do
    pid=$(resolve_product_id "$s")
    if [ -z "$pid" ]; then
      log_fail "  cannot resolve product slug: $s"
      return 1
    fi
    ids_json=$(echo "$ids_json" | jq --arg id "$pid" '. + [$id]')
    echo "    • product: $s → $pid"
  done

  # Fetch the page documentId
  local doc_id
  doc_id=$(curl -sS -G "${STRAPI_URL}/api/dynamic-pages" \
    --data-urlencode "filters[slug][\$eq]=${slug}" \
    --data-urlencode "locale=fr" \
    -H "$AUTH_HEADER" | jq -r '.data[0].documentId // empty')

  if [ -z "$doc_id" ]; then
    log_fail "  dynamic-page with slug '$slug' not found"
    return 1
  fi

  local locale section_data current_sections filtered_sections merged payload response err
  for locale in fr en mg; do
    section_data=$(jq --arg loc "$locale" --argjson ids "$ids_json" \
      '.locales[$loc] | . + {products: $ids}' "$file")

    if [ "$section_data" = "null" ] || [ -z "$section_data" ]; then
      continue
    fi

    # Fetch current sections, strip any previous featured-products, append new one.
    current_sections=$(curl -sS -G "${STRAPI_URL}/api/dynamic-pages/${doc_id}" \
      --data-urlencode "locale=${locale}" \
      --data-urlencode "populate=sections" \
      -H "$AUTH_HEADER" | jq '.data.sections // []')

    filtered_sections=$(echo "$current_sections" \
      | jq '[.[] | select(.__component != "page.featured-products") | del(.id)]')

    merged=$(echo "$filtered_sections" | jq --argjson sec "$section_data" '. + [$sec]')
    payload=$(jq -n --argjson sections "$merged" '{data: {sections: $sections}}')

    response=$(curl -sS -X PUT "${STRAPI_URL}/api/dynamic-pages/${doc_id}?locale=${locale}" \
      -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
    err=$(_extract_error "$response")
    if [ -n "$err" ]; then
      log_fail "  featured-products [$locale]: $err"
      echo "$response" | jq -r '.error.details.errors[]? | "    - \(.path|join(".")): \(.message)"' >&2 || true
      return 1
    fi
    echo "    • page $slug [$locale] sections updated"
  done
}

# ---- Step runner -----------------------------------------------------------
run_step() {
  local label="$1"
  shift
  log_step "$label"
  if "$@"; then
    log_ok "$label"
    echo ""
  else
    log_fail "$label"
    exit 1
  fi
}

# ---- Transforms -----------------------------------------------------------
# Products: replace categorySlug with category relation (documentId).
_products_transform_tmp=$(mktemp)
trap 'rm -f "$_products_transform_tmp"' EXIT

products_transform_entry() {
  local entry="$1"
  local cat_slug cat_id sel_slug sel_id

  # Strip image URL helpers (schema expects media documentIds, not URLs).
  entry=$(echo "$entry" | jq 'del(.imageUrls, .images)')

  # Resolve category slug → relation documentId.
  cat_slug=$(echo "$entry" | jq -r '.categorySlug // empty')
  if [ -n "$cat_slug" ]; then
    cat_id=$(resolve_category_id "$cat_slug")
    if [ -z "$cat_id" ]; then
      log_fail "  cannot resolve category slug: $cat_slug"
      return 1
    fi
    entry=$(echo "$entry" | jq --arg id "$cat_id" 'del(.categorySlug) | .category = $id')
  else
    entry=$(echo "$entry" | jq 'del(.categorySlug)')
  fi

  # Resolve seller slug → relation documentId.
  sel_slug=$(echo "$entry" | jq -r '.sellerSlug // empty')
  if [ -n "$sel_slug" ]; then
    sel_id=$(resolve_seller_id "$sel_slug")
    if [ -z "$sel_id" ]; then
      log_fail "  cannot resolve seller slug: $sel_slug"
      return 1
    fi
    entry=$(echo "$entry" | jq --arg id "$sel_id" 'del(.sellerSlug) | .seller = $id')
  else
    entry=$(echo "$entry" | jq 'del(.sellerSlug)')
  fi

  echo "$entry"
}

# Because load_collection_mutation applies a single jq filter, we handle
# products with a dedicated loop that resolves the category per entry.
load_products_with_categories() {
  local file="$1"
  local entries_count idx
  entries_count=$(jq '.data | length' "$file")
  log_info "  collection=api::product.product  entries=$entries_count  endpoint=/api/products"

  for idx in $(seq 0 $((entries_count - 1))); do
    local raw entry locale localizations slug name response err doc_id existing payload
    raw=$(jq ".data[$idx]" "$file")
    locale=$(echo "$raw" | jq -r '.locale // "fr"')
    localizations=$(echo "$raw" | jq '.localizations // {}')
    slug=$(echo "$raw" | jq -r '.slug')
    name=$(echo "$raw" | jq -r '.name')

    entry=$(echo "$raw" | jq 'del(.locale, .localizations)')
    entry=$(products_transform_entry "$entry") || return 1

    existing=$(curl -sS -G "${STRAPI_URL}/api/products" \
      --data-urlencode "filters[slug][\$eq]=${slug}" \
      --data-urlencode "locale=${locale}" \
      -H "$AUTH_HEADER" -H "$JSON_HEADER")
    doc_id=$(echo "$existing" | jq -r '.data[0].documentId // empty')

    payload=$(jq -n --argjson data "$entry" '{data: $data}')
    if [ -z "$doc_id" ] || [ "$doc_id" = "null" ]; then
      response=$(curl -sS -X POST "${STRAPI_URL}/api/products?locale=${locale}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
    else
      response=$(curl -sS -X PUT "${STRAPI_URL}/api/products/${doc_id}?locale=${locale}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
    fi

    err=$(_extract_error "$response")
    if [ -n "$err" ]; then
      log_fail "  $name ($locale): $err"
      echo "$response" | jq -r '.error.details.errors[]? | "    - \(.path|join(".")): \(.message)"' >&2 || true
      return 1
    fi

    doc_id=$(echo "$response" | jq -r '.data.documentId // empty')
    echo "    • $name → $doc_id"

    local loc loc_data loc_payload loc_response loc_err
    for loc in $(echo "$localizations" | jq -r 'keys[]?'); do
      loc_data=$(echo "$localizations" | jq ".\"$loc\"")
      loc_data=$(jq -n --argjson base "$entry" --argjson loc "$loc_data" '$base * $loc')
      loc_payload=$(jq -n --argjson data "$loc_data" '{data: $data}')
      loc_response=$(curl -sS -X PUT "${STRAPI_URL}/api/products/${doc_id}?locale=${loc}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$loc_payload")
      loc_err=$(_extract_error "$loc_response")
      if [ -n "$loc_err" ]; then
        log_fail "  $name localization [$loc]: $loc_err"
        return 1
      fi
    done
  done
}

# Voyage-product bundles: resolves productSlugs → product documentIds per entry
# and strips cover image URL helpers (media must be uploaded separately).
load_voyage_product_bundles() {
  local file="$1"
  local entries_count idx
  entries_count=$(jq '.data | length' "$file")
  log_info "  collection=api::voyage-product-bundle.voyage-product-bundle  entries=$entries_count  endpoint=/api/voyage-product-bundles"

  for idx in $(seq 0 $((entries_count - 1))); do
    local raw entry locale localizations slug name product_ids slugs s pid
    local existing doc_id payload response err

    raw=$(jq ".data[$idx]" "$file")
    locale=$(echo "$raw" | jq -r '.locale // "fr"')
    localizations=$(echo "$raw" | jq '.localizations // {}')
    slug=$(echo "$raw" | jq -r '.routeSlug')
    name=$(echo "$raw" | jq -r '.routeName')

    # Strip helper fields (URLs + slug list) from the base payload.
    entry=$(echo "$raw" | jq 'del(.locale, .localizations, .coverImageUrl, .productSlugs)')

    # Resolve productSlugs → documentIds
    product_ids="[]"
    slugs=$(echo "$raw" | jq -r '.productSlugs[]?')
    for s in $slugs; do
      pid=$(resolve_product_id "$s")
      if [ -z "$pid" ]; then
        log_fail "  cannot resolve product slug: $s (bundle=$slug)"
        return 1
      fi
      product_ids=$(echo "$product_ids" | jq --arg id "$pid" '. + [$id]')
    done
    entry=$(echo "$entry" | jq --argjson ids "$product_ids" '.products = $ids')

    existing=$(curl -sS -G "${STRAPI_URL}/api/voyage-product-bundles" \
      --data-urlencode "filters[routeSlug][\$eq]=${slug}" \
      --data-urlencode "locale=${locale}" \
      -H "$AUTH_HEADER" -H "$JSON_HEADER")
    doc_id=$(echo "$existing" | jq -r '.data[0].documentId // empty')

    payload=$(jq -n --argjson data "$entry" '{data: $data}')
    if [ -z "$doc_id" ] || [ "$doc_id" = "null" ]; then
      response=$(curl -sS -X POST "${STRAPI_URL}/api/voyage-product-bundles?locale=${locale}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
    else
      response=$(curl -sS -X PUT "${STRAPI_URL}/api/voyage-product-bundles/${doc_id}?locale=${locale}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
    fi
    err=$(_extract_error "$response")
    if [ -n "$err" ]; then
      log_fail "  $name ($locale): $err"
      echo "$response" | jq -r '.error.details.errors[]? | "    - \(.path|join(".")): \(.message)"' >&2 || true
      return 1
    fi

    doc_id=$(echo "$response" | jq -r '.data.documentId // empty')
    echo "    • $name → $doc_id"

    local loc loc_data loc_payload loc_response loc_err
    for loc in $(echo "$localizations" | jq -r 'keys[]?'); do
      loc_data=$(echo "$localizations" | jq ".\"$loc\"")
      loc_data=$(jq -n --argjson base "$entry" --argjson loc "$loc_data" '$base * $loc')
      loc_payload=$(jq -n --argjson data "$loc_data" '{data: $data}')
      loc_response=$(curl -sS -X PUT "${STRAPI_URL}/api/voyage-product-bundles/${doc_id}?locale=${loc}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$loc_payload")
      loc_err=$(_extract_error "$loc_response")
      if [ -n "$loc_err" ]; then
        log_fail "  $name localization [$loc]: $loc_err"
        return 1
      fi
    done
  done
}

# Subcategories: each entry has `category: { slug: "<top-category-slug>" }`.
# We resolve that slug → top-level Category documentId before POST/PUT.
load_subcategories_with_parent() {
  local file="$1"
  local entries_count idx
  entries_count=$(jq '.data | length' "$file")
  log_info "  collection=api::product-category.product-category  entries=$entries_count  endpoint=/api/product-categories"

  for idx in $(seq 0 $((entries_count - 1))); do
    local raw entry locale localizations slug name parent_slug parent_id
    local existing doc_id payload response err

    raw=$(jq ".data[$idx]" "$file")
    locale=$(echo "$raw" | jq -r '.locale // "fr"')
    localizations=$(echo "$raw" | jq '.localizations // {}')
    slug=$(echo "$raw" | jq -r '.slug')
    name=$(echo "$raw" | jq -r '.name')
    parent_slug=$(echo "$raw" | jq -r '.category.slug // empty')

    if [ -z "$parent_slug" ]; then
      log_fail "  $name: missing category.slug"
      return 1
    fi

    parent_id=$(resolve_top_category_id "$parent_slug")
    if [ -z "$parent_id" ]; then
      log_fail "  cannot resolve top-level category slug: $parent_slug (subcategory=$slug)"
      return 1
    fi

    entry=$(echo "$raw" \
      | jq 'del(.locale, .localizations, .category)' \
      | jq --arg id "$parent_id" '.category = $id')

    existing=$(curl -sS -G "${STRAPI_URL}/api/product-categories" \
      --data-urlencode "filters[slug][\$eq]=${slug}" \
      --data-urlencode "locale=${locale}" \
      -H "$AUTH_HEADER" -H "$JSON_HEADER")
    doc_id=$(echo "$existing" | jq -r '.data[0].documentId // empty')

    payload=$(jq -n --argjson data "$entry" '{data: $data}')
    if [ -z "$doc_id" ] || [ "$doc_id" = "null" ]; then
      response=$(curl -sS -X POST "${STRAPI_URL}/api/product-categories?locale=${locale}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
    else
      response=$(curl -sS -X PUT "${STRAPI_URL}/api/product-categories/${doc_id}?locale=${locale}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
    fi

    err=$(_extract_error "$response")
    if [ -n "$err" ]; then
      log_fail "  $name ($locale): $err"
      echo "$response" | jq -r '.error.details.errors[]? | "    - \(.path|join(".")): \(.message)"' >&2 || true
      return 1
    fi

    doc_id=$(echo "$response" | jq -r '.data.documentId // empty')
    echo "    • $name → $doc_id (parent=$parent_slug)"

    local loc loc_data loc_payload loc_response loc_err
    for loc in $(echo "$localizations" | jq -r 'keys[]?'); do
      loc_data=$(echo "$localizations" | jq ".\"$loc\"")
      loc_data=$(jq -n --argjson base "$entry" --argjson loc "$loc_data" '$base * $loc')
      loc_payload=$(jq -n --argjson data "$loc_data" '{data: $data}')
      loc_response=$(curl -sS -X PUT "${STRAPI_URL}/api/product-categories/${doc_id}?locale=${loc}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$loc_payload")
      loc_err=$(_extract_error "$loc_response")
      if [ -n "$loc_err" ]; then
        log_fail "  $name localization [$loc]: $loc_err"
        return 1
      fi
    done
  done
}

# ---- Pipeline --------------------------------------------------------------

run_step "1/10 categories (top-level)" \
  load_collection_mutation "$SCRIPT_DIR/categories.mutation.json" "categories" \
    'del(.imageUrl)'

run_step "2/10 product-categories (subcategories)" \
  load_subcategories_with_parent "$SCRIPT_DIR/subcategories.mutation.json"

run_step "3/10 sellers" \
  load_collection_mutation "$SCRIPT_DIR/sellers.mutation.json" "sellers"

run_step "4/10 products" \
  load_products_with_categories "$SCRIPT_DIR/malagasy-products.mutation.json"

run_step "5/10 voyage-product-bundles" \
  load_voyage_product_bundles "$SCRIPT_DIR/voyage-product-bundles.mutation.json"

run_step "6/10 koperative-partners" \
  load_collection_mutation "$SCRIPT_DIR/koperative-partners.mutation.json" "koperative-partners"

run_step "7/10 shop-banner (single type)" \
  load_single_type_with_transform "$SCRIPT_DIR/shop-banner.mutation.json" "shop-banner" \
    'del(.backgroundImageUrl)'

run_step "8/10 featured-products section (page.$PAGE_SLUG) [SKIPPED]" \
  true # Skipped to avoid overwriting nested relations in other dynamic sections

run_step "9/10 shop-configuration (legacy single type)" \
  load_single_type_mutation "$SCRIPT_DIR/shop-configuration.mutation.json" "shop-configuration"

run_step "10/10 promotion-banner (legacy single type)" \
  load_single_type_mutation "$SCRIPT_DIR/promotion-banners.mutation.json" "promotion-banner"

echo "=========================================="
log_ok "All shop content populated successfully."
echo "=========================================="

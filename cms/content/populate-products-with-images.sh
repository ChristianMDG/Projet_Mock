#!/usr/bin/env bash
# =============================================================================
# Populate sellers + Malagasy products in Strapi.
#
# For every product:
#   1. Search www.ketrika.com for a matching product image (by product name,
#      then by a fallback keyword).
#   2. Download the image, upload it to Strapi /api/upload.
#   3. POST/PUT the product with category, seller and image relations
#      (locale fr + en + mg).
#
# Required env: STRAPI_API_TOKEN (Strapi token with full admin scope).
# Optional env: STRAPI_URL (default http://localhost:1337)
# =============================================================================
set -euo pipefail

STRAPI_URL="${STRAPI_URL:-http://localhost:1337}"
KETRIKA_BASE="https://www.ketrika.com"
KETRIKA_SEARCH="$KETRIKA_BASE/home.jsp?but=vente/produit_home"
COOKIE_JAR="$(mktemp)"
trap 'rm -f "$COOKIE_JAR"' EXIT

if [ -z "${STRAPI_API_TOKEN:-}" ]; then
  echo "Error: STRAPI_API_TOKEN env var is required." >&2
  exit 1
fi
AUTH_HEADER="Authorization: Bearer ${STRAPI_API_TOKEN}"
JSON_HEADER="Content-Type: application/json"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRODUCTS_FILE="$SCRIPT_DIR/malagasy-products.mutation.json"
SELLERS_FILE="$SCRIPT_DIR/sellers.mutation.json"

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

log()   { echo -e "\033[0;34mℹ\033[0m  $*"; }
ok()    { echo -e "\033[0;32m✓\033[0m  $*"; }
warn()  { echo -e "\033[1;33m!\033[0m  $*"; }
fail()  { echo -e "\033[0;31m✗\033[0m  $*" >&2; }

_extract_error() { echo "${1:-}" | jq -r '.error.message // empty' 2>/dev/null; }

# -------- Strapi helpers ----------------------------------------------------
api_get_doc_id() {
  local plural="$1" slug="$2" locale="${3:-fr}"
  curl -sS -G "${STRAPI_URL}/api/${plural}" \
    --data-urlencode "filters[slug][\$eq]=${slug}" \
    --data-urlencode "locale=${locale}" \
    -H "$AUTH_HEADER" -H "$JSON_HEADER" \
    | jq -r '.data[0].documentId // empty'
}

resolve_category()       { api_get_doc_id "product-categories" "$1"; }
resolve_seller()         { api_get_doc_id "sellers" "$1"; }

# -------- Sellers populate (collection, no media) ---------------------------
populate_sellers() {
  local entries idx
  entries=$(jq '.data | length' "$SELLERS_FILE")
  log "Sellers: $entries entries"
  for idx in $(seq 0 $((entries - 1))); do
    local raw entry locale localizations slug name doc_id existing payload response err
    raw=$(jq ".data[$idx]" "$SELLERS_FILE")
    locale=$(echo "$raw" | jq -r '.locale // "fr"')
    localizations=$(echo "$raw" | jq '.localizations // {}')
    slug=$(echo "$raw" | jq -r '.slug')
    name=$(echo "$raw" | jq -r '.name')
    entry=$(echo "$raw" | jq 'del(.locale, .localizations)')

    existing=$(curl -sS -G "${STRAPI_URL}/api/sellers" \
      --data-urlencode "filters[slug][\$eq]=${slug}" \
      --data-urlencode "locale=${locale}" \
      -H "$AUTH_HEADER" -H "$JSON_HEADER")
    doc_id=$(echo "$existing" | jq -r '.data[0].documentId // empty')

    if [ -z "$doc_id" ] || [ "$doc_id" = "null" ]; then
      payload=$(jq -n --argjson data "$entry" '{data: $data}')
      response=$(curl -sS -X POST "${STRAPI_URL}/api/sellers?locale=${locale}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
    else
      echo "    • $name already exists, skipping update to avoid overwrite"
      continue
    fi
    err=$(_extract_error "$response")
    if [ -n "$err" ]; then fail "seller $slug ($locale): $err"; return 1; fi
    doc_id=$(echo "$response" | jq -r '.data.documentId // empty')
    echo "    • $name → $doc_id"

    local loc loc_data loc_payload loc_response loc_err
    for loc in $(echo "$localizations" | jq -r 'keys[]?'); do
      loc_data=$(echo "$localizations" | jq ".\"$loc\"")
      loc_data=$(jq -n --argjson base "$entry" --argjson loc "$loc_data" '$base * $loc')
      loc_payload=$(jq -n --argjson data "$loc_data" '{data: $data}')
      loc_response=$(curl -sS -X PUT "${STRAPI_URL}/api/sellers/${doc_id}?locale=${loc}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$loc_payload")
      loc_err=$(_extract_error "$loc_response")
      if [ -n "$loc_err" ]; then fail "seller $slug [$loc]: $loc_err"; return 1; fi
    done
  done
  ok "Sellers populated"
}

# -------- Ketrika image search ---------------------------------------------
# Warm cookie jar once.
ketrika_warmup() {
  curl -sSL -A "$UA" "$KETRIKA_BASE/home.jsp" \
    -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
    --max-time 20 -o /dev/null || true
}

# Echo first /img/product/300/... URL on the search results page.
ketrika_search_first_image() {
  local query="$1"
  local html
  html=$(curl -sSL -A "$UA" -X POST "$KETRIKA_SEARCH" \
    -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
    --data-urlencode "produit=${query}" --data-urlencode "type=" \
    --max-time 25 || true)
  echo "$html" | grep -oE 'src="https://static[^"]*/img/product/300/[^"]+"' \
    | head -n 1 | sed -E 's/^src="//;s/"$//'
}

# Build candidate keyword list for a product, ordered from most-specific to
# most-generic. Echoes one query per line.
keyword_candidates() {
  local slug="$1"
  case "$slug" in
    vanille-bourbon-premium)        printf '%s\n' "vanille bourbon" "vanille" ;;
    lamba-soie-sauvage)             printf '%s\n' "lamba soie" "lamba" "soie" ;;
    panier-raphia-tresse)           printf '%s\n' "panier raphia" "raphia" "panier" ;;
    miel-de-litchi)                 printf '%s\n' "miel litchi" "miel" "tantely" ;;
    sculpture-palissandre)          printf '%s\n' "sculpture palissandre" "palissandre" "sculpture bois" "bois" "decoration" ;;
    poivre-sauvage-tsiperifery)     printf '%s\n' "tsiperifery" "poivre sauvage" "poivre" ;;
    sac-voyage-rabane)              printf '%s\n' "sac rabane" "rabane" "sac voyage" "sac" "valise" ;;
    cafe-arabica-bourbon)           printf '%s\n' "café arabica" "arabica" "café" ;;
    huile-essentielle-ravintsara)   printf '%s\n' "ravintsara" "huile essentielle" "menaka manitra" ;;
    nappe-brodee-antaimoro)         printf '%s\n' "antaimoro" "papier antaimoro" "nappe" ;;
    rhum-arrange-vanille-cannelle)  printf '%s\n' "rhum arrangé" "rhum" "vanille cannelle" ;;
    sel-rose-onilahy)               printf '%s\n' "sel rose" "sel onilahy" "sel" ;;
    beurre-karite-malagasy)         printf '%s\n' "beurre karité" "karité" "karite" ;;
    chapeau-panama-malagasy)        printf '%s\n' "chapeau panama" "chapeau" "satrana" ;;
    savon-artisanal-ylang-ylang)    printf '%s\n' "savon ylang" "ylang ylang" "savon" ;;
    trousse-toilette-rabane)        printf '%s\n' "trousse rabane" "trousse" "rabane" ;;
    *)                              printf '%s\n' "$slug" ;;
  esac
}

# Find an image URL for a product; echo URL on success, empty on failure.
find_product_image_url() {
  local slug="$1"
  local query img_url
  while IFS= read -r query; do
    [ -z "$query" ] && continue
    img_url=$(ketrika_search_first_image "$query")
    if [ -n "$img_url" ]; then
      echo "$img_url"
      return 0
    fi
  done < <(keyword_candidates "$slug")
  return 0
}

# -------- Strapi upload -----------------------------------------------------
# Download $url to $local_path; echo a guessed extension.
download_image() {
  local url="$1" out="$2"
  curl -sSL -A "$UA" "$url" -b "$COOKIE_JAR" -o "$out" \
    --max-time 30 --fail
}

# Upload local file to Strapi, echo numeric file id (or empty).
strapi_upload() {
  local file="$1" filename="$2"
  local response id err
  response=$(curl -sS -X POST "${STRAPI_URL}/api/upload" \
    -H "$AUTH_HEADER" \
    -F "files=@${file};filename=${filename}")
  err=$(echo "$response" | jq -r '.error.message // empty' 2>/dev/null || echo "")
  if [ -n "$err" ]; then fail "upload error: $err"; return 1; fi
  id=$(echo "$response" | jq -r '.[0].id // empty' 2>/dev/null)
  if [ -z "$id" ] || [ "$id" = "null" ]; then
    fail "no upload id returned"
    echo "$response" >&2
    return 1
  fi
  echo "$id"
}

# -------- Products populate -------------------------------------------------
populate_products() {
  local entries idx
  entries=$(jq '.data | length' "$PRODUCTS_FILE")
  log "Products: $entries entries"

  for idx in $(seq 0 $((entries - 1))); do
    local raw entry locale localizations slug name cat_slug sel_slug cat_id sel_id
    local img_url img_path img_ext img_id existing doc_id payload response err

    raw=$(jq ".data[$idx]" "$PRODUCTS_FILE")
    locale=$(echo "$raw" | jq -r '.locale // "fr"')
    localizations=$(echo "$raw" | jq '.localizations // {}')
    slug=$(echo "$raw" | jq -r '.slug')
    name=$(echo "$raw" | jq -r '.name')
    cat_slug=$(echo "$raw" | jq -r '.categorySlug')
    sel_slug=$(echo "$raw" | jq -r '.sellerSlug')

    log "[$((idx + 1))/$entries] $name ($slug)"

    cat_id=$(resolve_category "$cat_slug")
    if [ -z "$cat_id" ]; then fail "unknown category: $cat_slug"; return 1; fi
    sel_id=$(resolve_seller "$sel_slug")
    if [ -z "$sel_id" ]; then fail "unknown seller: $sel_slug"; return 1; fi
    echo "    category=${cat_slug} -> ${cat_id}  seller=${sel_slug} -> ${sel_id}"

    # Strip helper fields, attach relations.
    entry=$(echo "$raw" | jq \
      --arg cat "$cat_id" --arg sel "$sel_id" \
      'del(.locale, .localizations, .imageUrls, .images, .categorySlug, .sellerSlug)
       | .category = $cat
       | .seller = $sel')

    # Look up existing entry (slug is non-localized → only fr lookup needed,
    # but we still pass locale for consistency).
    existing=$(curl -sS -G "${STRAPI_URL}/api/products" \
      --data-urlencode "filters[slug][\$eq]=${slug}" \
      --data-urlencode "locale=${locale}" \
      --data-urlencode "populate=images" \
      -H "$AUTH_HEADER" -H "$JSON_HEADER")
    doc_id=$(echo "$existing" | jq -r '.data[0].documentId // empty')
    local existing_image_count
    existing_image_count=$(echo "$existing" | jq '[.data[0].images[]?] | length' 2>/dev/null || echo 0)

    # Acquire image only if the product has none yet.
    img_id=""
    if [ "$existing_image_count" = "0" ] || [ -z "$existing_image_count" ]; then
      img_url=$(find_product_image_url "$slug" || true)
      if [ -n "$img_url" ]; then
        echo "    image: $img_url"
        img_ext="${img_url##*.}"
        img_ext="${img_ext%%\?*}"
        case "$img_ext" in jpg|jpeg|png|webp) ;; *) img_ext="jpg" ;; esac
        img_path=$(mktemp -t "ket_${slug}_XXXX")".${img_ext}"
        if download_image "$img_url" "$img_path"; then
          img_id=$(strapi_upload "$img_path" "${slug}.${img_ext}" || true)
          if [ -n "$img_id" ]; then
            echo "    uploaded → media id $img_id"
          fi
          rm -f "$img_path"
        else
          warn "    download failed"
        fi
      else
        warn "    no ketrika image found for $slug"
      fi
      if [ -n "$img_id" ]; then
        entry=$(echo "$entry" | jq --argjson id "$img_id" '.images = [$id]')
      fi
    else
      echo "    image: keeping existing ($existing_image_count file(s))"
    fi

    local is_new="false"
    if [ -z "$doc_id" ] || [ "$doc_id" = "null" ]; then
      is_new="true"
      payload=$(jq -n --argjson data "$entry" '{data: $data}')
      response=$(curl -sS -X POST "${STRAPI_URL}/api/products?locale=${locale}" \
        -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
    else
      # If product exists, ONLY update it if we acquired a new image,
      # and ONLY send the images field to avoid overwriting other content.
      if [ -n "$img_id" ]; then
        payload=$(jq -n --arg id "$img_id" '{data: {images: [$id]}}')
        response=$(curl -sS -X PUT "${STRAPI_URL}/api/products/${doc_id}?locale=${locale}" \
          -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")
      else
        echo "    skipping update (product exists, no new image)"
        continue
      fi
    fi
    err=$(_extract_error "$response")
    if [ -n "$err" ]; then
      fail "$slug ($locale): $err"
      echo "$response" | jq -r '.error.details.errors[]? | "    - \(.path|join(".")): \(.message)"' >&2 || true
      return 1
    fi
    doc_id=$(echo "$response" | jq -r '.data.documentId // empty')
    echo "    saved → $doc_id"

    # Localizations (en, mg). Merge over base entry so non-localized fields
    # (price, sku, relations, image) are preserved.
    # Only create them if this is a newly inserted product, to avoid overwriting existing CMS translations.
    if [ "$is_new" = "true" ]; then
      local loc loc_data loc_payload loc_response loc_err
      for loc in $(echo "$localizations" | jq -r 'keys[]?'); do
        loc_data=$(echo "$localizations" | jq ".\"$loc\"")
        loc_data=$(jq -n --argjson base "$entry" --argjson loc "$loc_data" '$base * $loc')
        loc_payload=$(jq -n --argjson data "$loc_data" '{data: $data}')
        loc_response=$(curl -sS -X PUT "${STRAPI_URL}/api/products/${doc_id}?locale=${loc}" \
          -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$loc_payload")
        loc_err=$(_extract_error "$loc_response")
        if [ -n "$loc_err" ]; then
          fail "$slug [$loc]: $loc_err"
          echo "$loc_response" | jq -r '.error.details.errors[]? | "    - \(.path|join(".")): \(.message)"' >&2 || true
          return 1
        fi
      done
    fi
  done
  ok "Products populated"
}

# -------- Run ---------------------------------------------------------------
log "Strapi:  $STRAPI_URL"
log "Ketrika: $KETRIKA_BASE"
echo ""

log "Step 1/3 — sellers"
populate_sellers
echo ""

log "Step 2/3 — warm Ketrika session"
ketrika_warmup
ok "Ketrika cookie jar warmed"
echo ""

log "Step 3/3 — products (ketrika image + Strapi upload)"
populate_products
echo ""
ok "Done."

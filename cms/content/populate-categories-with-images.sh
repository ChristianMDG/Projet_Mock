#!/usr/bin/env bash
# =============================================================================
# Populate / Update Category Images in Strapi with Madagascar-specific visuals.
#
# For every top-level category:
#   1. Reads the local image in cms/content/images/categories/<slug>.jpg
#   2. Uploads it to Strapi /api/upload (which syncs to Cloudinary)
#   3. Updates the category (api::category.category) with the uploaded media ID
#   4. Outputs the resulting Cloudinary URL
#
# Works on both local (http://localhost:1337) and production (https://cms.taxibrousse.mg)
#
# Usage:
#   STRAPI_API_TOKEN=your_token ./populate-categories-with-images.sh
#   STRAPI_URL=https://cms.taxibrousse.mg STRAPI_API_TOKEN=your_token ./populate-categories-with-images.sh
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="${SCRIPT_DIR}/images/categories"
MUTATION_FILE="${SCRIPT_DIR}/vista-categories.mutation.json"

STRAPI_URL="${STRAPI_URL:-http://localhost:1337}"
DEFAULT_TOKEN="76e3cb93535d3bb0202778f64cc212be01959f500d8972ec7297f1c31ada26ef7f859f389f1daedc72bd2b8ef2991c6379c22e0d35e7ba3fd99936f6834ca03f93268c58ca9a70e2f1638073b8056e432ccfefc51cf2f4d2473022c2a3f082a91e429b9448c8028c490f3b9b24cedf2a1fa0dd90ccb39b10361c91296f1c4871"
STRAPI_API_TOKEN="${STRAPI_API_TOKEN:-$DEFAULT_TOKEN}"

AUTH_HEADER="Authorization: Bearer ${STRAPI_API_TOKEN}"
JSON_HEADER="Content-Type: application/json"

log()   { echo -e "\033[0;34mℹ\033[0m  $*"; }
ok()    { echo -e "\033[0;32m✓\033[0m  $*"; }
warn()  { echo -e "\033[1;33m!\033[0m  $*"; }
fail()  { echo -e "\033[0;31m✗\033[0m  $*" >&2; }

echo ""
echo "=========================================================="
echo "  Populate Madagascar Category Images in Strapi"
echo "  Strapi URL: $STRAPI_URL"
echo "=========================================================="
echo ""

CATEGORIES=(
  "appareils-electromenagers"
  "electroniques"
  "produits-blancs"
  "loisirs-et-voyages"
  "sports-et-loisirs"
)

# Upload local file to Strapi, echo numeric file id and URL
strapi_upload() {
  local file="$1" filename="$2"
  local response id url err
  response=$(curl -sS -X POST "${STRAPI_URL}/api/upload" \
    -H "$AUTH_HEADER" \
    -F "files=@${file};filename=${filename}")
  
  err=$(echo "$response" | jq -r '.error.message // empty' 2>/dev/null || echo "")
  if [ -n "$err" ]; then
    fail "Upload failed for $filename: $err"
    echo "$response" >&2
    return 1
  fi
  
  id=$(echo "$response" | jq -r '.[0].id // empty' 2>/dev/null)
  url=$(echo "$response" | jq -r '.[0].url // empty' 2>/dev/null)
  
  if [ -z "$id" ] || [ "$id" = "null" ]; then
    fail "No upload ID returned for $filename"
    echo "$response" >&2
    return 1
  fi
  
  echo "${id}|${url}"
}

# Resolve category documentId and current image ID
get_category_info() {
  local slug="$1"
  local response
  response=$(curl -sS -G "${STRAPI_URL}/api/categories" \
    --data-urlencode "filters[slug][\$eq]=${slug}" \
    --data-urlencode "locale=fr" \
    --data-urlencode "populate=image" \
    -H "$AUTH_HEADER" -H "$JSON_HEADER")
  local doc_id img_id
  doc_id=$(echo "$response" | jq -r '.data[0].documentId // empty')
  img_id=$(echo "$response" | jq -r '.data[0].image.id // empty')
  echo "${doc_id}|${img_id}"
}

# Delete file from Strapi & Cloudinary
delete_strapi_file() {
  local file_id="$1"
  if [ -n "$file_id" ] && [ "$file_id" != "null" ]; then
    log "  Deleting older image (ID: $file_id) from Cloudinary..."
    local res
    res=$(curl -sS -X DELETE "${STRAPI_URL}/api/upload/files/${file_id}" \
      -H "$AUTH_HEADER")
    local err
    err=$(echo "$res" | jq -r '.error.message // empty' 2>/dev/null || echo "")
    if [ -n "$err" ]; then
      warn "  Could not delete old image $file_id: $err"
    else
      ok "  Older image (ID: $file_id) removed from Cloudinary"
    fi
  fi
}

UPLOADED_URLS_FILE=$(mktemp)
trap 'rm -f "$UPLOADED_URLS_FILE"' EXIT

for slug in "${CATEGORIES[@]}"; do
  img_file="${IMAGES_DIR}/${slug}.jpg"
  if [ ! -f "$img_file" ]; then
    warn "Image file not found: $img_file, skipping..."
    continue
  fi

  log "Processing category: $slug"
  cat_info=$(get_category_info "$slug")
  doc_id="${cat_info%%|*}"
  old_img_id="${cat_info##*|}"

  if [ -z "$doc_id" ]; then
    fail "Category with slug '$slug' not found in Strapi!"
    continue
  fi

  upload_res=$(strapi_upload "$img_file" "${slug}.jpg")
  media_id="${upload_res%%|*}"
  media_url="${upload_res##*|}"

  echo "${slug}|${media_url}" >> "$UPLOADED_URLS_FILE"
  log "  Uploaded new media ID: $media_id ($media_url)"

  # Update category image relation
  payload=$(jq -n --argjson id "$media_id" '{data: {image: $id}}')
  update_res=$(curl -sS -X PUT "${STRAPI_URL}/api/categories/${doc_id}?locale=fr" \
    -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$payload")

  err=$(echo "$update_res" | jq -r '.error.message // empty' 2>/dev/null || echo "")
  if [ -n "$err" ]; then
    fail "Failed to update category $slug ($doc_id): $err"
    echo "$update_res" >&2
    continue
  fi

  ok "Category '$slug' ($doc_id) updated with Madagascar image"

  # Delete older image from Cloudinary if different
  if [ -n "$old_img_id" ] && [ "$old_img_id" != "$media_id" ]; then
    delete_strapi_file "$old_img_id"
  fi
done

# Update mutation file if it exists
if [ -f "$MUTATION_FILE" ]; then
  log "Updating $MUTATION_FILE with uploaded Cloudinary URLs..."
  tmp_file=$(mktemp)
  cp "$MUTATION_FILE" "$tmp_file"

  while IFS='|' read -r slug url; do
    if [ -n "$slug" ] && [ -n "$url" ]; then
      jq --arg s "$slug" --arg u "$url" \
        '(.data[] | select(.slug == $s)).imageUrl = $u' "$tmp_file" > "${tmp_file}.next" && mv "${tmp_file}.next" "$tmp_file"
    fi
  done < "$UPLOADED_URLS_FILE"

  mv "$tmp_file" "$MUTATION_FILE"
  ok "Updated $MUTATION_FILE"
fi

echo ""
echo "=========================================================="
ok "All category images successfully replaced and updated!"
echo "=========================================================="

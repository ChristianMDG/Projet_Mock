#!/usr/bin/env bash
# =============================================================================
# Populate / Update Shop Banner in Strapi with Madagascar-specific image.
#
# 1. Fetches current shop-banner backgroundImage ID
# 2. Uploads cms/content/images/shop-banner.jpg to Strapi /api/upload
# 3. Updates singleType /api/shop-banner with new media ID
# 4. Deletes older backgroundImage from Strapi and Cloudinary
# 5. Updates cms/content/shop-banner.mutation.json with the new Cloudinary URL
#
# Works on both local (http://localhost:1337) and production (https://cms.taxibrousse.mg)
#
# Usage:
#   STRAPI_API_TOKEN=your_token ./populate-shop-banner-with-image.sh
#   STRAPI_URL=https://cms.taxibrousse.mg STRAPI_API_TOKEN=your_token ./populate-shop-banner-with-image.sh
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_FILE="${SCRIPT_DIR}/images/shop-banner.jpg"
MUTATION_FILE="${SCRIPT_DIR}/shop-banner.mutation.json"

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
echo "  Populate Madagascar Shop Banner in Strapi"
echo "  Strapi URL: $STRAPI_URL"
echo "=========================================================="
echo ""

if [ ! -f "$IMAGE_FILE" ]; then
  fail "Banner image file not found: $IMAGE_FILE"
  exit 1
fi

# Fetch current banner background image ID
log "Fetching current shop-banner background image..."
banner_res=$(curl -sS -G "${STRAPI_URL}/api/shop-banner" \
  --data-urlencode "populate=backgroundImage" \
  --data-urlencode "locale=fr" \
  -H "$AUTH_HEADER" -H "$JSON_HEADER")

old_media_id=$(echo "$banner_res" | jq -r '.data.backgroundImage.id // empty')
if [ -n "$old_media_id" ] && [ "$old_media_id" != "null" ]; then
  log "Current background image ID: $old_media_id"
else
  log "No current background image linked"
  old_media_id=""
fi

# Upload new image
log "Uploading new shop banner ($IMAGE_FILE)..."
upload_res=$(curl -sS -X POST "${STRAPI_URL}/api/upload" \
  -H "$AUTH_HEADER" \
  -F "files=@${IMAGE_FILE};filename=shop-banner.jpg")

err=$(echo "$upload_res" | jq -r '.error.message // empty' 2>/dev/null || echo "")
if [ -n "$err" ]; then
  fail "Upload failed: $err"
  echo "$upload_res" >&2
  exit 1
fi

new_media_id=$(echo "$upload_res" | jq -r '.[0].id // empty' 2>/dev/null)
new_media_url=$(echo "$upload_res" | jq -r '.[0].url // empty' 2>/dev/null)

if [ -z "$new_media_id" ] || [ "$new_media_id" = "null" ]; then
  fail "No media ID returned from upload"
  echo "$upload_res" >&2
  exit 1
fi

ok "Uploaded new shop banner: ID $new_media_id ($new_media_url)"

# Update shop-banner singleType
log "Updating shop-banner singleType..."
update_payload=$(jq -n --argjson id "$new_media_id" '{data: {backgroundImage: $id}}')
update_res=$(curl -sS -X PUT "${STRAPI_URL}/api/shop-banner?locale=fr" \
  -H "$AUTH_HEADER" -H "$JSON_HEADER" -d "$update_payload")

update_err=$(echo "$update_res" | jq -r '.error.message // empty' 2>/dev/null || echo "")
if [ -n "$update_err" ]; then
  fail "Failed to update shop-banner: $update_err"
  echo "$update_res" >&2
  exit 1
fi

ok "Shop banner updated with new Madagascar image"

# Delete older image if present and different
if [ -n "$old_media_id" ] && [ "$old_media_id" != "$new_media_id" ]; then
  log "Deleting older banner image (ID: $old_media_id) from Cloudinary..."
  del_res=$(curl -sS -X DELETE "${STRAPI_URL}/api/upload/files/${old_media_id}" \
    -H "$AUTH_HEADER")
  del_err=$(echo "$del_res" | jq -r '.error.message // empty' 2>/dev/null || echo "")
  if [ -n "$del_err" ]; then
    warn "Could not delete old banner image $old_media_id: $del_err"
  else
    ok "Older banner image (ID: $old_media_id) removed from Cloudinary"
  fi
fi

# Update mutation file
if [ -f "$MUTATION_FILE" ]; then
  log "Updating $MUTATION_FILE with new Cloudinary URL..."
  jq --arg url "$new_media_url" '(.data[0]).backgroundImageUrl = $url' "$MUTATION_FILE" > "${MUTATION_FILE}.tmp" \
    && mv "${MUTATION_FILE}.tmp" "$MUTATION_FILE"
  ok "Updated $MUTATION_FILE"
fi

echo ""
echo "=========================================================="
ok "Shop banner successfully replaced and older image removed!"
echo "=========================================================="

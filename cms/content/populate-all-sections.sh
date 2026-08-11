#!/bin/bash

# =============================================================================
# Strapi Dynamic Zone - Populate All Sections at Once
# Builds a single payload with all sections from *.mutation.json files
# =============================================================================

set -e

# Configuration
STRAPI_URL="${STRAPI_URL:-http://localhost:1337}"
STRAPI_API_TOKEN="${STRAPI_API_TOKEN:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAGE_SLUG="${1:-page-template}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Check requirements
if ! command -v jq &> /dev/null; then
  log_error "jq is required. Install with: brew install jq"
  exit 1
fi

if [ -z "$STRAPI_API_TOKEN" ]; then
  log_error "STRAPI_API_TOKEN environment variable is required."
  exit 1
fi

echo ""
echo "=========================================="
echo "  Populate All Sections - $PAGE_SLUG"
echo "=========================================="
echo ""

# Get document ID by slug (use default locale fr)
log_info "Fetching document ID for slug: $PAGE_SLUG"
DOC_ID=$(curl -s "${STRAPI_URL}/api/dynamic-pages?filters[slug][\$eq]=${PAGE_SLUG}" \
  -H "Authorization: Bearer ${STRAPI_API_TOKEN}" | jq -r '.data[0].documentId // empty')

if [ -z "$DOC_ID" ] || [ "$DOC_ID" = "null" ]; then
  # Try without filter
  DOC_ID=$(curl -s "${STRAPI_URL}/api/dynamic-pages" \
    -H "Authorization: Bearer ${STRAPI_API_TOKEN}" | jq -r --arg slug "$PAGE_SLUG" '.data[] | select(.slug == $slug) | .documentId')
fi

if [ -z "$DOC_ID" ] || [ "$DOC_ID" = "null" ]; then
  log_error "Page with slug '$PAGE_SLUG' not found!"
  exit 1
fi

log_success "Found document ID: $DOC_ID"
echo ""

# Get base page data from French locale for creating other locales
log_info "Fetching base page data from French locale..."
BASE_PAGE=$(curl -s "${STRAPI_URL}/api/dynamic-pages/${PAGE_SLUG}?locale=fr" \
  -H "Authorization: Bearer ${STRAPI_API_TOKEN}" | jq '.data')

BASE_TITLE=$(echo "$BASE_PAGE" | jq -r '.title // "Page Template"')
BASE_SLUG=$(echo "$BASE_PAGE" | jq -r '.slug // "page-template"')
BASE_ICON=$(echo "$BASE_PAGE" | jq -r '.icon // "Info"')
BASE_PAGE_HEADER=$(echo "$BASE_PAGE" | jq '.pageHeader | del(.id) // {
  "title": "Welcome",
  "subtitle": "Your reliable transport platform",
  "alertType": "info",
  "alertTitle": "Important",
  "alertMessage": "Important information",
  "description": "Discover our platform"
}')

log_success "Base page: $BASE_TITLE ($BASE_SLUG)"
echo ""

# Build sections array for each locale
for locale in fr en mg; do
  log_info "Building sections for locale: $locale"
  
  # Check if locale exists, if not create it
  locale_check=$(curl -s "${STRAPI_URL}/api/dynamic-pages/${PAGE_SLUG}?locale=${locale}" \
    -H "Authorization: Bearer ${STRAPI_API_TOKEN}" | jq -r '.data.documentId // empty')
  
  if [ -z "$locale_check" ] || [ "$locale_check" = "null" ]; then
    log_info "Creating localized entry for: $locale"
    
    # Determine localized title
    case $locale in
      en) loc_title="Page Template"; loc_subtitle="Your reliable transport platform in Madagascar";;
      mg) loc_title="Pejy Modely"; loc_subtitle="Ny sehatra fitaterana azo ianteherana any Madagasikara";;
      *) loc_title="$BASE_TITLE"; loc_subtitle="Votre plateforme de transport fiable à Madagascar";;
    esac
    
    # Build pageHeader for this locale
    loc_page_header=$(echo "$BASE_PAGE_HEADER" | jq --arg title "$loc_title" --arg subtitle "$loc_subtitle" '. + {title: $title, subtitle: $subtitle}')
    
    create_payload=$(jq -n \
      --arg title "$loc_title" \
      --arg slug "$BASE_SLUG" \
      --arg icon "$BASE_ICON" \
      --argjson pageHeader "$loc_page_header" \
      '{
        data: {
          title: $title,
          slug: $slug,
          icon: $icon,
          pageHeader: $pageHeader
        }
      }')
    
    create_response=$(curl -s -X PUT \
      "${STRAPI_URL}/api/dynamic-pages/${DOC_ID}?locale=${locale}" \
      -H "Authorization: Bearer ${STRAPI_API_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "$create_payload")
    
    create_error=$(echo "$create_response" | jq -r '.error.message // empty')
    if [ -n "$create_error" ]; then
      log_error "Failed to create locale $locale: $create_error"
      continue
    fi
    log_success "Created localized entry for: $locale"
  fi
  
  # Collect all sections for this locale (only files with __component field)
  sections="[]"
  populated_files=""
  
  for file in "$SCRIPT_DIR"/*.mutation.json; do
    filename=$(basename "$file")
    section=$(jq --arg loc "$locale" '.locales[$loc] // empty' "$file")
    
    # Only include sections that have __component field (dynamic zone components)
    if [ -n "$section" ] && [ "$section" != "null" ]; then
      has_component=$(echo "$section" | jq -r '.__component // empty')
      if [ -n "$has_component" ] && [ "$has_component" != "null" ]; then
        sections=$(echo "$sections" | jq --argjson sec "$section" '. + [$sec]')
        populated_files="$populated_files $filename"
        log_success "  Loaded: $filename"
      else
        echo -e "${YELLOW}  ⏭️  Skipped (no __component): $filename${NC}"
      fi
    fi
  done
  
  section_count=$(echo "$sections" | jq 'length')
  log_info "Total sections for $locale: $section_count"
  echo "  Files:$populated_files"
  
  # Build the payload
  payload=$(jq -n --argjson sections "$sections" '{
    data: {
      sections: $sections
    }
  }')
  
  # Update the page
  log_info "Updating page-template for locale: $locale"
  
  response=$(curl -s -X PUT \
    "${STRAPI_URL}/api/dynamic-pages/${DOC_ID}?locale=${locale}" \
    -H "Authorization: Bearer ${STRAPI_API_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$payload")
  
  # Check for errors
  error=$(echo "$response" | jq -r '.error.message // empty')
  
  if [ -n "$error" ]; then
    log_error "Failed for $locale: $error"
    # Show detailed error info
    echo "$response" | jq -r '.error.details.errors[]? | "  - \(.path | join(".")): \(.message)"' 2>/dev/null
  else
    log_success "Updated page-template for locale: $locale"
  fi
  
  echo ""
done

echo "=========================================="
log_success "All locales updated!"
echo "=========================================="

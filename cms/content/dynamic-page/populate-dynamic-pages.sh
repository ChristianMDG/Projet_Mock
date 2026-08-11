#!/bin/bash

# =============================================================================
# Strapi Dynamic Pages - Upsert Script
# Creates or updates dynamic pages from *.mutation.json files
# =============================================================================

set -e

# Configuration
STRAPI_URL="${STRAPI_URL:-http://localhost:1337}"
STRAPI_API_TOKEN="${STRAPI_API_TOKEN:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Check requirements
if ! command -v jq &> /dev/null; then
  log_error "jq is required. Install with: brew install jq"
  exit 1
fi

if [ -z "$STRAPI_API_TOKEN" ]; then
  log_error "STRAPI_API_TOKEN environment variable is required."
  echo "Usage: STRAPI_API_TOKEN=your_token ./populate-dynamic-pages.sh"
  exit 1
fi

echo ""
echo "=========================================="
echo "  Strapi Dynamic Pages Upsert"
echo "=========================================="
echo ""
log_info "Strapi URL: $STRAPI_URL"
echo ""

# Count mutation files
mutation_files=("$SCRIPT_DIR"/*.mutation.json)
if [ ! -e "${mutation_files[0]}" ]; then
  log_warning "No *.mutation.json files found in $SCRIPT_DIR"
  exit 0
fi

file_count=${#mutation_files[@]}
log_info "Found $file_count mutation file(s)"
echo ""

# Process each mutation file
for file in "${mutation_files[@]}"; do
  filename=$(basename "$file")
  echo "------------------------------------------"
  log_info "Processing: $filename"
  
  # Extract metadata
  description=$(jq -r '.description // "No description"' "$file")
  collection=$(jq -r '.collection // "api::dynamic-page.dynamic-page"' "$file")
  slug=$(jq -r '.slug' "$file")
  
  if [ -z "$slug" ] || [ "$slug" = "null" ]; then
    log_error "Missing 'slug' in $filename - skipping"
    continue
  fi
  
  log_info "Slug: $slug"
  log_info "Description: $description"
  
  # Check if page exists (search by slug in default locale)
  existing=$(curl -s "${STRAPI_URL}/api/dynamic-pages?locale=fr" \
    -H "Authorization: Bearer ${STRAPI_API_TOKEN}")
  
  doc_id=$(echo "$existing" | jq -r --arg slug "$slug" '.data[] | select(.slug == $slug) | .documentId // empty' | head -1)
  
  # Process each locale
  for locale in fr en mg; do
    locale_data=$(jq --arg loc "$locale" '.locales[$loc] // empty' "$file")
    
    if [ -z "$locale_data" ] || [ "$locale_data" = "null" ]; then
      log_warning "No data for locale '$locale' in $filename - skipping"
      continue
    fi
    
    # Build payload
    payload=$(jq -n --argjson data "$locale_data" '{ data: $data }')
    
    if [ -z "$doc_id" ] || [ "$doc_id" = "null" ]; then
      # CREATE new entry
      if [ "$locale" = "fr" ]; then
        log_info "Creating new page for locale: $locale"
        
        response=$(curl -s -X POST \
          "${STRAPI_URL}/api/dynamic-pages?locale=${locale}" \
          -H "Authorization: Bearer ${STRAPI_API_TOKEN}" \
          -H "Content-Type: application/json" \
          -d "$payload")
        
        error=$(echo "$response" | jq -r '.error.message // empty')
        
        if [ -n "$error" ]; then
          log_error "Failed to create page: $error"
          echo "$response" | jq '.'
          continue
        fi
        
        # Get the new document ID
        doc_id=$(echo "$response" | jq -r '.data.documentId // empty')
        log_success "Created page with documentId: $doc_id"
      else
        # Create localization for non-fr locales
        if [ -n "$doc_id" ] && [ "$doc_id" != "null" ]; then
          log_info "Creating localization for locale: $locale"
          
          response=$(curl -s -X PUT \
            "${STRAPI_URL}/api/dynamic-pages/${doc_id}?locale=${locale}" \
            -H "Authorization: Bearer ${STRAPI_API_TOKEN}" \
            -H "Content-Type: application/json" \
            -d "$payload")
          
          error=$(echo "$response" | jq -r '.error.message // empty')
          
          if [ -n "$error" ]; then
            log_error "Failed to create localization for $locale: $error"
          else
            log_success "Created localization for: $locale"
          fi
        fi
      fi
    else
      # UPDATE existing entry
      log_info "Updating page for locale: $locale"
      
      response=$(curl -s -X PUT \
        "${STRAPI_URL}/api/dynamic-pages/${doc_id}?locale=${locale}" \
        -H "Authorization: Bearer ${STRAPI_API_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "$payload")
      
      error=$(echo "$response" | jq -r '.error.message // empty')
      
      if [ -n "$error" ]; then
        log_error "Failed to update page for $locale: $error"
        echo "$response" | jq '.'
      else
        log_success "Updated page for locale: $locale"
      fi
    fi
  done
  
  echo ""
done

echo "=========================================="
log_success "Dynamic pages upsert completed!"
echo "=========================================="

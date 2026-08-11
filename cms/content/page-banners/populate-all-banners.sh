#!/bin/bash

# Script to populate all banner contents in Strapi
# Usage: ./populate-all-banners.sh

API_URL="${STRAPI_API_URL:-http://localhost:1337}"
API_TOKEN="${STRAPI_API_TOKEN}"

if [ -z "$API_TOKEN" ]; then
  echo "Error: STRAPI_API_TOKEN environment variable is not set"
  echo "Please set it with: export STRAPI_API_TOKEN=your_token_here"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BANNERS_DIR="$SCRIPT_DIR"

echo "Starting banner population process..."
echo "API URL: $API_URL"
echo "Banners directory: $BANNERS_DIR"
echo ""

# Function to process a mutation file
process_mutation() {
  local file=$1
  local filename=$(basename "$file")
  
  echo "Processing $filename..."
  
  # Read the JSON file
  local json_content=$(cat "$file")
  
  # Extract collection and slug
  local collection=$(echo "$json_content" | jq -r '.collection')
  local slug=$(echo "$json_content" | jq -r '.slug')
  local description=$(echo "$json_content" | jq -r '.description')
  
  echo "  Collection: $collection"
  echo "  Slug: $slug"
  echo "  Description: $description"
  
  # Determine API path from collection
  local api_path
  case "$collection" in
    "api::hero-content.hero-content")
      api_path="/api/hero-contents"
      ;;
    "api::gare-banner.gare-banner")
      api_path="/api/gare-banner"
      ;;
    "api::koperative-banner.koperative-banner")
      api_path="/api/koperative-banner"
      ;;
    "api::promotion-banner.promotion-banner")
      api_path="/api/promotion-banner"
      ;;
    *)
      echo "  ⚠️  Unknown collection: $collection, skipping..."
      return
      ;;
  esac
  
  # Check if it's a single type (no slug filter needed)
  local is_single_type=false
  if [[ "$api_path" =~ ^/api/(gare-banner|koperative-banner|promotion-banner)$ ]]; then
    is_single_type=true
  fi
  
  # Process each locale
  for locale in fr en mg; do
    echo "  Processing locale: $locale"
    
    # Extract locale data
    local locale_data=$(echo "$json_content" | jq ".locales.$locale")
    
    if [ "$locale_data" = "null" ]; then
      echo "    ⚠️  No data for locale $locale, skipping..."
      continue
    fi
    
    # Check if entry exists
    local check_url
    if [ "$is_single_type" = true ]; then
      # Single type: just check by locale
      check_url="${API_URL}${api_path}?locale=${locale}"
    else
      # Collection type: check by slug and locale
      check_url="${API_URL}${api_path}?filters[slug][\$eq]=${slug}&locale=${locale}"
    fi
    
    local existing=$(curl -s -X GET "$check_url" \
      -H "Authorization: Bearer $API_TOKEN" \
      -H "Content-Type: application/json")
    
    if [ "$is_single_type" = true ]; then
      # For single types, check if data exists
      local has_data=$(echo "$existing" | jq 'has("data") and (.data | length > 0)' 2>/dev/null || echo "false")
      
      if [ "$has_data" = "true" ]; then
        # Update existing entry
        local document_id=$(echo "$existing" | jq -r '.data.documentId // .data[0].documentId')
        echo "    📝 Updating existing entry (documentId: $document_id)..."
        
        curl -s -X PUT "${API_URL}${api_path}" \
          -H "Authorization: Bearer $API_TOKEN" \
          -H "Content-Type: application/json" \
          -d "{\"data\": $locale_data, \"locale\": \"${locale}\"}" > /dev/null
        
        echo "    ✅ Updated successfully"
      else
        # Create new entry
        echo "    ➕ Creating new entry..."
        
        curl -s -X POST "${API_URL}${api_path}" \
          -H "Authorization: Bearer $API_TOKEN" \
          -H "Content-Type: application/json" \
          -d "{\"data\": $locale_data}" > /dev/null
        
        echo "    ✅ Created successfully"
      fi
    else
      # Collection type processing
      local existing_count=$(echo "$existing" | jq '.data | length' 2>/dev/null || echo "0")
      
      if [ "$existing_count" -gt 0 ] 2>/dev/null; then
        # Update existing entry
        local document_id=$(echo "$existing" | jq -r '.data[0].documentId')
        echo "    📝 Updating existing entry (documentId: $document_id)..."
        
        curl -s -X PUT "${API_URL}${api_path}/${document_id}" \
          -H "Authorization: Bearer $API_TOKEN" \
          -H "Content-Type: application/json" \
          -d "{\"data\": $locale_data}" > /dev/null
        
        echo "    ✅ Updated successfully"
      else
        # Create new entry
        echo "    ➕ Creating new entry..."
        
        curl -s -X POST "${API_URL}${api_path}" \
          -H "Authorization: Bearer $API_TOKEN" \
          -H "Content-Type: application/json" \
          -d "{\"data\": $locale_data}" > /dev/null
        
        echo "    ✅ Created successfully"
      fi
    fi
  done
  
  echo "  ✓ Completed $filename"
  echo ""
}

# Count total banners
total_files=$(find "$BANNERS_DIR" -name "*.mutation.json" | wc -l | tr -d ' ')
echo "Found $total_files banner mutation files"
echo "================================================"
echo ""

# Process each mutation file
count=0
for file in "$BANNERS_DIR"/*.mutation.json; do
  if [ -f "$file" ]; then
    count=$((count + 1))
    echo "[$count/$total_files] Processing banner..."
    process_mutation "$file"
  fi
done

echo "================================================"
echo "✅ All banners populated successfully!"
echo "Total processed: $count banners"

#!/usr/bin/env python3
"""
Sync product prices from products.mutation.json to remote/local Strapi CMS.
Targets:
  - https://cms.taxibrousse.mg (production default)
  - or http://localhost:1337

Usage:
  python3 cms/content/sync-prices-to-strapi.py
  python3 cms/content/sync-prices-to-strapi.py --url http://localhost:1337 --token <local_token>
"""

import argparse
import json
import os
import sys
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

DEFAULT_PROD_URL = "https://cms.taxibrousse.mg"
DEFAULT_PROD_TOKEN = (
    "2a1fa031ef9c9f38209dec00406f775c066fba8cce96a510d1cf662582399747"
    "e54d28dfafdd98fa1d2c957602d1227f0915948ee4dbe64337a202b4dc364fe5"
    "b9f968551b52125ddf7adff917bf6426d1e35e76a89ce8855fb799eb6a2e1e34"
    "747fafc7a13c4c0a8ec832a3c1973687aafd2de654255188851e475d2313008f"
)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PRODUCTS_JSON_PATH = os.path.join(SCRIPT_DIR, "products.mutation.json")


def fetch_all_strapi_products(base_url: str, token: str):
    """Fetch all products from Strapi to map slug and sku to documentId and current price."""
    page = 1
    page_size = 100
    strapi_products = {}

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "User-Agent": "Taxibrousse-PriceSync/1.0",
    }

    print(f"Fetching existing products from {base_url}...")
    while True:
        url = f"{base_url}/api/products?pagination[page]={page}&pagination[pageSize]={page_size}"
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            print(f"HTTP Error {e.code}: {e.read().decode()}", file=sys.stderr)
            sys.exit(1)

        items = data.get("data", [])
        for item in items:
            doc_id = item.get("documentId")
            slug = item.get("slug")
            sku = item.get("sku")
            current_price = item.get("price")
            name = item.get("name")

            info = {
                "documentId": doc_id,
                "name": name,
                "slug": slug,
                "sku": sku,
                "current_price": current_price,
            }
            if slug:
                strapi_products[slug] = info
            if sku:
                strapi_products[f"sku:{sku.lower()}"] = info

        meta = data.get("meta", {}).get("pagination", {})
        total_pages = meta.get("pageCount", page)
        print(f"  Page {page}/{total_pages} fetched ({len(items)} products)...")

        if page >= total_pages:
            break
        page += 1

    print(f"Loaded total {len(items) + (page - 2) * page_size} entries from Strapi.\n")
    return strapi_products


def update_single_product(base_url: str, token: str, doc_id: str, new_price: int, name: str):
    """Send PUT request to update product price by documentId."""
    url = f"{base_url}/api/products/{doc_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "User-Agent": "Taxibrousse-PriceSync/1.0",
    }
    payload = json.dumps({"data": {"price": new_price}}).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers=headers, method="PUT")

    try:
        with urllib.request.urlopen(req) as resp:
            res_data = json.loads(resp.read().decode())
            return True, doc_id, name, new_price, None
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode()
        return False, doc_id, name, new_price, f"HTTP {e.code}: {error_msg}"
    except Exception as e:
        return False, doc_id, name, new_price, str(e)


def sync_to_strapi(base_url: str, token: str, dry_run: bool = False, workers: int = 8):
    print("=" * 70)
    print("  Syncing Product Prices to Strapi CMS")
    print(f"  Target URL: {base_url}")
    print(f"  Mode:       {'DRY RUN (no modifications)' if dry_run else 'APPLY LIVE'}")
    print("=" * 70)

    # 1. Load local mutation products
    with open(PRODUCTS_JSON_PATH, "r", encoding="utf-8") as f:
        mutation_data = json.load(f).get("data", [])

    items_with_price = [p for p in mutation_data if p.get("price", 0) > 0]
    print(f"Found {len(items_with_price)} products with price > 0 in products.mutation.json\n")

    # 2. Fetch Strapi catalog
    strapi_catalog = fetch_all_strapi_products(base_url, token)

    # 3. Identify updates
    to_update = []
    not_found = []
    already_up_to_date = []

    for p in items_with_price:
        slug = p.get("slug")
        sku = p.get("sku")
        target_price = p.get("price")

        info = strapi_catalog.get(slug)
        if not info and sku:
            info = strapi_catalog.get(f"sku:{sku.lower()}")

        if not info:
            not_found.append(p)
            continue

        doc_id = info["documentId"]
        current_price = info.get("current_price")

        # Compare prices (convert both to float/int)
        if current_price is not None and float(current_price) == float(target_price):
            already_up_to_date.append((info["name"], target_price))
        else:
            to_update.append((doc_id, info["name"], current_price, target_price))

    print("-" * 70)
    print(f"Products already up-to-date: {len(already_up_to_date)}")
    print(f"Products requiring update:   {len(to_update)}")
    print(f"Products not found in CMS:   {len(not_found)}")
    print("-" * 70)

    if not_found:
        print("\nProducts not found in Strapi CMS:")
        for nf in not_found:
            print(f"  - {nf.get('name')} (slug: {nf.get('slug')}, sku: {nf.get('sku')})")

    if not to_update:
        print("\nAll products are already synchronized with the latest prices!")
        return

    print(f"\nSample of products to update (first 10):")
    for doc_id, name, cur_p, target_p in to_update[:10]:
        cur_str = f"{int(cur_p):,d} Ar" if cur_p is not None else "None"
        print(f"  - {name[:40]:40} : {cur_str:>12} -> {target_p:>12,d} Ar")

    if dry_run:
        print(f"\nDRY RUN complete. {len(to_update)} products would be updated.")
        return

    print(f"\nApplying {len(to_update)} price updates via {workers} concurrent workers...")
    success_count = 0
    fail_count = 0

    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {
            executor.submit(update_single_product, base_url, token, doc_id, target_p, name): name
            for doc_id, name, cur_p, target_p in to_update
        }

        for future in as_completed(futures):
            ok, doc_id, name, price, err = future.result()
            if ok:
                success_count += 1
                if success_count % 20 == 0 or success_count == len(to_update):
                    print(f"  Progress: {success_count}/{len(to_update)} products updated...")
            else:
                fail_count += 1
                print(f"  FAILED: {name} ({doc_id}) -> {err}", file=sys.stderr)

    print("\n" + "=" * 70)
    print(f"  Synchronization Finished!")
    print(f"  Successful updates: {success_count}")
    print(f"  Failed updates:     {fail_count}")
    print(f"  Total with price:   {len(items_with_price)}")
    print("=" * 70)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sync product prices to Strapi CMS")
    parser.add_argument("--url", default=DEFAULT_PROD_URL, help=f"Strapi base URL (default: {DEFAULT_PROD_URL})")
    parser.add_argument("--token", default=DEFAULT_PROD_TOKEN, help="Strapi Bearer API token")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without applying updates")
    parser.add_argument("--workers", type=int, default=8, help="Number of concurrent update workers (default: 8)")
    args = parser.parse_args()

    sync_to_strapi(base_url=args.url.rstrip("/"), token=args.token, dry_run=args.dry_run, workers=args.workers)

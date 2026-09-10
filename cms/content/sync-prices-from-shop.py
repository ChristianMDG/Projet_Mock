#!/usr/bin/env python3
"""
Sync prices from cms/content/shop.html to Vista products mutation files:
- cms/content/vista-products.mutation.json
- cms/content/products.mutation.json

Extracts:
- Price from class="woocommerce-Price-amount amount"
- Title from class="woocommerce-loop-product__title"
- SKU from class="product-sku"
- Link from class="woocommerce-LoopProduct-link"

Matches against Vista products catalog and assigns accurate Ariary prices.
"""

import argparse
import json
import os
import re
import sys
from bs4 import BeautifulSoup

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SHOP_HTML_PATH = os.path.join(SCRIPT_DIR, "shop.html")
VISTA_MUTATION_PATH = os.path.join(SCRIPT_DIR, "vista-products.mutation.json")
PRODUCTS_MUTATION_PATH = os.path.join(SCRIPT_DIR, "products.mutation.json")

# Model aliases mapping normalized SKU variants from shop.html to normalized Vista SKUs
SKU_ALIASES = {
    # Autocuiseurs / Cocottes Minute: PCOxx -> PC-0xx
    "pco51": "pc051",
    "pco71": "pc071",
    "pco91": "pc091",
    "pco111": "pc111",
    # Petit électroménager / Ustensiles
    "ktg16gc": "ktg116gc",
    "sm270gw": "sm270sgw",
    "hb1710": "hb1710m",
    "hsc7192t": "hsc7192td",
    "mg530": "mg540",
    "vrh602x": "vrh604x",
    "rt54l": "rt53l",
    "to3320r": "to370r",
    # Cuiseurs à riz
    "rc225d9": "rc225d1",
    "rc225d8": "rc225d1",
    "rc427": "rc429",
    "rc802": "rc808",
    "rc1006": "rc1009",
    # Froid & Réfrigérateurs / Congélateurs
    "sc28wh": "sc28gr14bl14",
    "cd28lwh1": "cd28lgwh14gr14bu14bl14",
    "cd35wh1": "cd35lwh14gr14",
    "rc6wh": "rc6wh1bl1sl1",
    "rc8wh1": "rc8wh1bl1sl1",
    "rd20sl14": "rd20bl11ss11",
    "rd20sl11ss11": "rd20bl11ss11",
    "rd26ss11": "rd26bl11ss11",
    # Solaire
    "scd10lwhgr7dc": "scd10lgr7adc",
    "scd17lwhgr7dc": "scd17lgr7adc",
    "scd23lwhgr7dc": "scd23lgr7adc",
    "skpmc030": "skpmc030318v",
    "skpmc050": "skpmc050318v",
    # Groupes électrogènes
    "dev6500aw": "dev6500cw",
    "gev1800": "gev1800c",
    "gev2500": "gev2500b",
    "gev3500": "gev3500c",
    "gev6500": "gev6504a",
    "gev8000": "gev8004a3p",
    "ski1000w2": "ski1500w2",
    # Gaz
    "vgb1005x": "vgb1007x",
    "vgb2005x": "vgb2007x",
    # Ventilateurs
    "fs1615rc": "fs1602rc",
    "fs1608t": "fd1608",
    "fs1612rc": "fs1602rc",
}


def normalize_code(s: str) -> str:
    """Normalize code to lowercase alphanumeric without punctuation or spaces."""
    if not s:
        return ""
    return re.sub(r"[^a-z0-9]", "", s.lower())


def extract_price_from_element(price_el) -> int:
    """Extract integer price in Ariary from woocommerce-Price-amount element."""
    if not price_el:
        return 0
    raw_text = price_el.get_text()
    digits = re.sub(r"[^\d]", "", raw_text)
    return int(digits) if digits else 0


def get_sku_root(sku: str) -> str:
    """Extract base model root from a Vista SKU (e.g., 'CD-60LDD-WH14 / GR14' -> 'cd60ldd')."""
    if not sku:
        return ""
    clean = re.sub(r"\([^)]*\)", "", sku).split("/")[0].strip()
    parts = clean.split("-")
    if len(parts) >= 2:
        return normalize_code(parts[0] + parts[1])
    return normalize_code(parts[0])


def load_shop_products(html_path: str):
    """Parse shop.html and extract all product entries."""
    if not os.path.exists(html_path):
        raise FileNotFoundError(f"shop.html not found at {html_path}")

    with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    products = []
    for li in soup.find_all("li", class_=lambda c: c and "product" in c.split()):
        title_el = li.find(class_="woocommerce-loop-product__title")
        price_el = li.find(class_="woocommerce-Price-amount")
        sku_el = li.find(class_="product-sku")
        link_el = li.find("a", class_="woocommerce-LoopProduct-link")

        title = " ".join(title_el.get_text().split()) if title_el else ""
        price = extract_price_from_element(price_el)
        raw_sku = sku_el.get_text(strip=True) if sku_el else ""
        clean_sku = re.sub(r"^SKU:\s*", "", raw_sku)
        clean_sku = re.sub(r"^7310", "", clean_sku).strip()
        href = link_el["href"] if (link_el and link_el.has_attr("href")) else ""

        if title or price:
            products.append({
                "title": title,
                "price": price,
                "clean_sku": clean_sku,
                "raw_sku": raw_sku,
                "href": href,
            })

    return products


def build_vista_indexes(vista_products):
    """Build fast lookup indexes for Vista products catalog."""
    by_sku = {}
    by_root = {}

    for p in vista_products:
        sku = p.get("sku", "")
        norm_sku = normalize_code(sku)
        if norm_sku:
            by_sku[norm_sku] = p

        root = get_sku_root(sku)
        if len(root) >= 3 and root not in by_root:
            by_root[root] = p

    return by_sku, by_root


def match_product(shop_item, by_sku, by_root):
    """
    Match a shop item against the Vista catalog using multi-level matching:
    1. Alias table mapping
    2. Specific semantic rules (Smart 32 TV, solar regulators)
    3. Direct normalized SKU match
    4. Model code tokens extracted from title
    5. Base model root match
    """
    title = shop_item["title"]
    clean_sku = shop_item["clean_sku"]
    norm_csku = normalize_code(clean_sku)

    # 1. Alias lookup
    if norm_csku in SKU_ALIASES and SKU_ALIASES[norm_csku] in by_sku:
        return by_sku[SKU_ALIASES[norm_csku]], f"alias_{norm_csku}"

    # 2. Semantic rules
    lower_title = title.lower()
    if "smart" in lower_title and "32" in lower_title:
        if "led3265hdsd" in by_sku:
            return by_sku["led3265hdsd"], "semantic_smart_32_tv"

    if "régulateur" in lower_title:
        if "20a" in lower_title and "cmtp0220a" in by_sku:
            return by_sku["cmtp0220a"], "semantic_regulator_20a"
        if "60a" in lower_title and "cmtp0360a" in by_sku:
            return by_sku["cmtp0360a"], "semantic_regulator_60a"

    # 3. Direct SKU match
    if norm_csku and norm_csku != "na" and norm_csku in by_sku:
        return by_sku[norm_csku], "direct_sku"

    # 4. Title tokens match
    tokens = re.findall(r"[A-Za-z0-9]+(?:[-/][A-Za-z0-9]+)*", title)
    for tok in tokens:
        nt = normalize_code(tok)
        if nt in SKU_ALIASES and SKU_ALIASES[nt] in by_sku:
            return by_sku[SKU_ALIASES[nt]], f"token_alias_{tok}"
        if len(nt) >= 4 and nt in by_sku:
            return by_sku[nt], f"token_sku_{tok}"

    # 5. Base model root match
    if norm_csku and len(norm_csku) >= 4 and norm_csku != "na":
        for r, vp in by_root.items():
            if len(r) >= 4 and (r in norm_csku or norm_csku.startswith(r)):
                return vp, f"root_sku_{r}"

    # 6. Check root against title tokens
    for tok in tokens:
        nt = normalize_code(tok)
        if len(nt) >= 4:
            for r, vp in by_root.items():
                if len(r) >= 4 and (r == nt or r in nt or nt.startswith(r)):
                    return vp, f"root_token_{r}"

    return None, "none"


def sync_prices(apply_changes: bool = False, offset: int = 25000):
    print("=" * 70)
    print("  Syncing Prices from shop.html to Vista Products Mutation Files")
    print(f"  Mode:   {'APPLY CHANGES' if apply_changes else 'DRY RUN'}")
    print(f"  Offset: +{offset:,d} Ar on matched non-zero prices")
    print("=" * 70)

    shop_items = load_shop_products(SHOP_HTML_PATH)
    print(f"Loaded {len(shop_items)} products from {SHOP_HTML_PATH}")

    with open(VISTA_MUTATION_PATH, "r", encoding="utf-8") as f:
        vista_json = json.load(f)

    vista_products = vista_json.get("data", [])
    print(f"Loaded {len(vista_products)} products in Vista catalog\n")

    by_sku, by_root = build_vista_indexes(vista_products)

    matched = []
    unmatched = []
    assigned_slugs = set()

    for item in shop_items:
        prod, method = match_product(item, by_sku, by_root)
        if prod:
            base_price = item["price"]
            final_price = (base_price + offset) if base_price > 0 else 0
            matched.append((item, prod, method, final_price))
            prod["price"] = final_price
            assigned_slugs.add(prod.get("slug"))
        else:
            unmatched.append(item)

    print(f"Matched:   {len(matched)} / {len(shop_items)} shop products")
    print(f"Unmatched: {len(unmatched)} / {len(shop_items)} shop products")
    print(f"Unique Vista catalog products updated: {len(assigned_slugs)}")
    print("-" * 70)

    print("\nSample Matched Products (First 20):")
    for i, (item, prod, method, final_price) in enumerate(matched[:20]):
        title_trunc = (item["title"][:38] + "..") if len(item["title"]) > 38 else item["title"].ljust(40)
        vista_name = (prod["name"][:30] + "..") if len(prod["name"]) > 30 else prod["name"].ljust(32)
        print(f"{i+1:2d}. {title_trunc} -> {item['price']:>8,d} Ar (+{offset:,d} = {final_price:>8,d} Ar) -> {vista_name} [{prod.get('sku')}]")

    if unmatched:
        print("\nUnmatched Shop Products (absent from catalog):")
        for u in unmatched:
            print(f"- {u['title']} | SKU: {u['clean_sku']} | Price: {u['price']:,d} Ar")

    if apply_changes:
        print("\nSaving updated files...")
        with open(VISTA_MUTATION_PATH, "w", encoding="utf-8") as f:
            json.dump(vista_json, f, indent=2, ensure_ascii=False)
            f.write("\n")
        print(f"Saved: {VISTA_MUTATION_PATH}")

        # Also sync to products.mutation.json
        if os.path.exists(PRODUCTS_MUTATION_PATH):
            with open(PRODUCTS_MUTATION_PATH, "w", encoding="utf-8") as f:
                json.dump(vista_json, f, indent=2, ensure_ascii=False)
                f.write("\n")
            print(f"Saved: {PRODUCTS_MUTATION_PATH}")

        print("\nPrice synchronization successfully completed!")
    else:
        print("\nDRY RUN complete. Run with --apply to write changes to JSON files.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sync prices from shop.html to vista mutation files")
    parser.add_argument("--apply", action="store_true", help="Apply changes directly to JSON files")
    parser.add_argument("--offset", type=int, default=25000, help="Amount in Ariary to add to matched non-zero prices (default: 25000)")
    args = parser.parse_args()

    sync_prices(apply_changes=args.apply, offset=args.offset)

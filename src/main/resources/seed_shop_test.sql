BEGIN;

-- IDs élevés pour éviter les collisions avec des données existantes
-- Ajuste si besoin après un SELECT max(id) FROM categories;

-- 1) Catégorie parente
INSERT INTO categories (
  id, name, description, slug, is_active, display_order,
  created_at, updated_at, locale, published_at
) VALUES (
  9001,
  'Test Boutique',
  'Catégorie de test pour la boutique',
  'test-boutique',
  true,
  1,
  NOW(), NOW(), 'fr', NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  is_active = true,
  updated_at = NOW();

-- 2) Sous-catégorie (product_categories)
INSERT INTO product_categories (
  id, name, description, slug, is_active, display_order,
  created_at, updated_at, locale, published_at
) VALUES (
  9101,
  'Produits test',
  'Sous-catégorie de test',
  'produits-test',
  true,
  1,
  NOW(), NOW(), 'fr', NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  is_active = true,
  updated_at = NOW();

-- Lien sous-catégorie → catégorie
INSERT INTO product_categories_category_lnk (product_category_id, category_id)
VALUES (9101, 9001)
ON CONFLICT DO NOTHING;

-- 3) Produits
INSERT INTO products (
  id, name, description, short_description,
  price, original_price, sku, slug, currency,
  stock_quantity, weight,
  is_active, is_featured, is_new, is_best_seller,
  rating, review_count,
  created_at, updated_at, locale, published_at
) VALUES
(
  9201,
  'Sac voyage test',
  'Produit de test pour valider la boutique front.',
  'Sac de voyage léger',
  45000.00,
  55000.00,
  'TEST-SAC-001',
  'sac-voyage-test',
  'MGA',
  25,
  1.200,
  true, true, true, false,
  4.50, 3,
  NOW(), NOW(), 'fr', NOW()
),
(
  9202,
  'Casquette test',
  'Deuxième produit de test.',
  'Casquette unisexe',
  15000.00,
  NULL,
  'TEST-CASQ-001',
  'casquette-test',
  'MGA',
  50,
  0.200,
  true, false, true, true,
  4.00, 1,
  NOW(), NOW(), 'fr', NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  is_active = true,
  stock_quantity = EXCLUDED.stock_quantity,
  updated_at = NOW();

-- Lien produit → sous-catégorie
INSERT INTO products_category_lnk (product_id, product_category_id)
VALUES
  (9201, 9101),
  (9202, 9101)
ON CONFLICT DO NOTHING;

-- 4) Images (URLs placeholder)
INSERT INTO product_image (
  id, url, alt_text, display_order, is_primary, product_id,
  created_at, updated_at, locale, published_at
) VALUES
(
  9301,
  'https://placehold.co/600x600/png?text=Sac+Test',
  'Sac voyage test',
  0,
  true,
  9201,
  NOW(), NOW(), 'fr', NOW()
),
(
  9302,
  'https://placehold.co/600x600/png?text=Casquette+Test',
  'Casquette test',
  0,
  true,
  9202,
  NOW(), NOW(), 'fr', NOW()
)
ON CONFLICT (id) DO UPDATE SET
  url = EXCLUDED.url,
  is_primary = true,
  updated_at = NOW();

-- 5) Inventaire (optionnel mais utile)
INSERT INTO inventory (
  id, product_id, variant_id, quantity, reserved, version,
  created_at, updated_at, locale, published_at
) VALUES
  (9401, 9201, NULL, 25, 0, 0, NOW(), NOW(), 'fr', NOW()),
  (9402, 9202, NULL, 50, 0, 0, NOW(), NOW(), 'fr', NOW())
ON CONFLICT (id) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  updated_at = NOW();

-- Remettre les séquences au-dessus des IDs utilisés
SELECT setval(pg_get_serial_sequence('categories', 'id'), GREATEST((SELECT MAX(id) FROM categories), 9001));
SELECT setval(pg_get_serial_sequence('product_categories', 'id'), GREATEST((SELECT MAX(id) FROM product_categories), 9101));
SELECT setval(pg_get_serial_sequence('products', 'id'), GREATEST((SELECT MAX(id) FROM products), 9202));
SELECT setval(pg_get_serial_sequence('product_image', 'id'), GREATEST((SELECT MAX(id) FROM product_image), 9302));
SELECT setval(pg_get_serial_sequence('inventory', 'id'), GREATEST((SELECT MAX(id) FROM inventory), 9402));

COMMIT;

-- Vérification
SELECT c.id, c.name, c.slug FROM categories c WHERE c.id = 9001;
SELECT pc.id, pc.name, pc.slug FROM product_categories pc WHERE pc.id = 9101;
SELECT p.id, p.name, p.slug, p.price, p.is_active, p.stock_quantity FROM products p WHERE p.id IN (9201, 9202);
-- Seed complet test shop (contrainte status déjà étendue + payment MOBILE_MONEY)
BEGIN;

-- ---------------------------------------------------------------------------
-- Produits de test (IDs 9101-9105)
-- ---------------------------------------------------------------------------
INSERT INTO products (
    id, name, description, short_description, price, original_price, sku, slug,
    currency, stock_quantity, weight, is_active, is_featured, is_new, is_best_seller,
    rating, review_count, created_at, published_at, locale, document_id
) VALUES
    (9101, 'Extracteur de Jus JE-1680S',
     'Produit test Vista France', 'Extracteur de jus',
     0, 0, 'JE-1680S', 'je-1680s-test', 'MGA', 50, 1.0,
     true, true, true, false, 4.50, 0, NOW(), NOW(), 'fr', 'testprodje1680s00000001'),
    (9102, 'Cuiseur à Riz RC-1009',
     'Produit test Vista France', 'Cuiseur à riz',
     0, 0, 'RC-1009-TEST', 'rc-1009-test', 'MGA', 40, 1.0,
     true, true, false, true, 4.50, 0, NOW(), NOW(), 'fr', 'testprodrc1009s0000001'),
    (9103, 'Friteuse à Air Chaud AF-925',
     'Produit test Vista France', 'Friteuse air',
     0, 0, 'AF-925-TEST', 'af-925-test', 'MGA', 30, 1.0,
     true, false, true, false, 4.50, 0, NOW(), NOW(), 'fr', 'testprodaf925000000001'),
    (9104, 'Smart TV LED-3265HD-SD',
     'Produit test Vista France', 'Smart TV 32"',
     0, 0, 'LED-3265-TEST', 'led-3265-test', 'MGA', 15, 5.0,
     true, true, true, true, 4.50, 0, NOW(), NOW(), 'fr', 'testprodled3265hd00001'),
    (9105, 'Ventilateur de Bureau FD-1608',
     'Produit test Vista France', 'Ventilateur 16"',
     0, 0, 'FD-1608-TEST', 'fd-1608-test', 'MGA', 60, 1.0,
     true, false, false, false, 4.50, 0, NOW(), NOW(), 'fr', 'testprodfd1608s0000001')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = 0,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = true,
    updated_at = NOW();

SELECT setval(
    pg_get_serial_sequence('products', 'id'),
    GREATEST((SELECT COALESCE(MAX(id), 1) FROM products), 9105)
);

-- ---------------------------------------------------------------------------
-- Commandes
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    v_ville_id BIGINT;
BEGIN
    SELECT id INTO v_ville_id FROM ville ORDER BY id LIMIT 1;

    DELETE FROM order_item WHERE order_id IN (
        SELECT id FROM shop_order WHERE order_number LIKE 'SO-TEST-%'
    );
    DELETE FROM shop_order WHERE order_number LIKE 'SO-TEST-%';

    INSERT INTO shop_order (
        order_number, customer_name, customer_email, customer_phone,
        delivery_address, billing_address,
        payment_method, status, previous_status, status_changed_at, status_change_reason,
        subtotal, shipping, tax, total, currency,
        pickup_code, delivery_method, ville_id,
        discount_amount, shipping_weight,
        created_at, published_at, locale, document_id
    ) VALUES
    (
        'SO-TEST-PENDING01', 'Rakoto Jean', 'rakoto.jean@test.mg', '0340000001',
        'Lot II M 45 Antananarivo', 'Lot II M 45 Antananarivo',
        'MOBILE_MONEY', 'PENDING', NULL, NULL, NULL,
        0, 0, 0, 0, 'MGA',
        '111111', 'STANDARD', v_ville_id,
        0, 1.0,
        NOW() - INTERVAL '5 days', NOW(), 'fr', 'testorderpending0000001'
    ),
    (
        'SO-TEST-READY0001', 'Rasoanirina Marie', 'marie.rasoa@test.mg', '0340000002',
        'Gare Soarano Antananarivo', 'Analakely Antananarivo',
        'MOBILE_MONEY', 'READY_IN_STORE', 'PROCESSING', NOW() - INTERVAL '2 days',
        'Colis emballé, prêt en magasin',
        0, 0, 0, 0, 'MGA',
        '222222', 'STANDARD', v_ville_id,
        0, 1.0,
        NOW() - INTERVAL '3 days', NOW(), 'fr', 'testorderready000000001'
    ),
    (
        'SO-TEST-STATION01', 'Andry Nirina', 'andry.nirina@test.mg', '0340000003',
        'Gare Fianarantsoa', 'Isotry Antananarivo',
        'MOBILE_MONEY', 'DELIVERY_TO_STATION', 'READY_IN_STORE', NOW() - INTERVAL '1 day',
        'Remis au réseau taxibrousse vers gare',
        0, 0, 0, 0, 'MGA',
        '333333', 'STANDARD', v_ville_id,
        0, 2.0,
        NOW() - INTERVAL '2 days', NOW(), 'fr', 'testorderstation0000001'
    ),
    (
        'SO-TEST-INPROG001', 'Hery Mamy', 'hery.mamy@test.mg', '0340000004',
        'Gare Toamasina', 'Ankorondrano Antananarivo',
        'MOBILE_MONEY', 'DELIVERY_IN_PROGRESS', 'DELIVERY_TO_STATION', NOW() - INTERVAL '12 hours',
        'En route vers gare de destination',
        0, 0, 0, 0, 'MGA',
        '444444', 'STANDARD', v_ville_id,
        0, 1.5,
        NOW() - INTERVAL '1 day', NOW(), 'fr', 'testorderinprog00000001'
    ),
    (
        'SO-TEST-COUNTER1', 'Voahirana Lala', 'voahirana@test.mg', '0340000005',
        'Gare Mahajanga — Guichet 2', 'Ambohijatovo Antananarivo',
        'MOBILE_MONEY', 'AVAILABLE_AT_COUNTER', 'DELIVERY_IN_PROGRESS', NOW() - INTERVAL '3 hours',
        'Disponible au guichet de destination',
        0, 0, 0, 0, 'MGA',
        '555555', 'STANDARD', v_ville_id,
        0, 1.0,
        NOW() - INTERVAL '20 hours', NOW(), 'fr', 'testordercounter0000001'
    ),
    (
        'SO-TEST-DELIVER1', 'Tiana Rabe', 'tiana.rabe@test.mg', '0340000006',
        'Gare Antsirabe', '67 Ha Antananarivo',
        'MOBILE_MONEY', 'DELIVERED', 'AVAILABLE_AT_COUNTER', NOW() - INTERVAL '1 hour',
        'Récupéré avec validation du code guichet',
        0, 0, 0, 0, 'MGA',
        '666666', 'STANDARD', v_ville_id,
        0, 1.0,
        NOW() - INTERVAL '2 days', NOW(), 'fr', 'testorderdeliver0000001'
    ),
    (
        'SO-TEST-CANCEL01', 'Client Annulé', 'annule@test.mg', '0340000007',
        '—', '—',
        'MOBILE_MONEY', 'CANCELLED', 'PENDING', NOW() - INTERVAL '4 days',
        'Annulation client — paiement non confirmé',
        0, 0, 0, 0, 'MGA',
        NULL, 'STANDARD', v_ville_id,
        0, 0,
        NOW() - INTERVAL '4 days', NOW(), 'fr', 'testordercancel00000001'
    ),
    (
        'SO-TEST-COUNTER2', 'Guest Test', NULL, '0330000099',
        'Gare Toliara — Guichet 1', NULL,
        'MOBILE_MONEY', 'AVAILABLE_AT_COUNTER', 'DELIVERY_IN_PROGRESS', NOW() - INTERVAL '1 hour',
        'Disponible au guichet',
        0, 0, 0, 0, 'MGA',
        '999999', 'STANDARD', v_ville_id,
        0, 1.0,
        NOW() - INTERVAL '6 hours', NOW(), 'fr', 'testordercounter0000002'
    );
END $$;

-- ---------------------------------------------------------------------------
-- Lignes de commande
-- ---------------------------------------------------------------------------
INSERT INTO order_item (
    order_id, product_id, product_name, product_sku, quantity, unit_price, line_total,
    created_at, published_at, locale, document_id
)
SELECT o.id, 9101, 'Extracteur de Jus JE-1680S', 'JE-1680S', 1, 0, 0,
       NOW(), NOW(), 'fr', left('toi' || o.id || 'a', 24)
FROM shop_order o WHERE o.order_number = 'SO-TEST-PENDING01'
UNION ALL
SELECT o.id, 9102, 'Cuiseur à Riz RC-1009', 'RC-1009', 2, 0, 0,
       NOW(), NOW(), 'fr', left('toi' || o.id || 'b', 24)
FROM shop_order o WHERE o.order_number = 'SO-TEST-READY0001'
UNION ALL
SELECT o.id, 9103, 'Friteuse à Air Chaud AF-925', 'AF-925', 1, 0, 0,
       NOW(), NOW(), 'fr', left('toi' || o.id || 'c', 24)
FROM shop_order o WHERE o.order_number = 'SO-TEST-STATION01'
UNION ALL
SELECT o.id, 9104, 'Smart TV LED-3265HD-SD', 'LED-3265-TEST', 1, 0, 0,
       NOW(), NOW(), 'fr', left('toi' || o.id || 'd', 24)
FROM shop_order o WHERE o.order_number = 'SO-TEST-INPROG001'
UNION ALL
SELECT o.id, 9101, 'Extracteur de Jus JE-1680S', 'JE-1680S', 1, 0, 0,
       NOW(), NOW(), 'fr', left('toi' || o.id || 'e', 24)
FROM shop_order o WHERE o.order_number = 'SO-TEST-COUNTER1'
UNION ALL
SELECT o.id, 9105, 'Ventilateur de Bureau FD-1608', 'FD-1608', 1, 0, 0,
       NOW(), NOW(), 'fr', left('toi' || o.id || 'f', 24)
FROM shop_order o WHERE o.order_number = 'SO-TEST-COUNTER1'
UNION ALL
SELECT o.id, 9102, 'Cuiseur à Riz RC-1009', 'RC-1009', 1, 0, 0,
       NOW(), NOW(), 'fr', left('toi' || o.id || 'g', 24)
FROM shop_order o WHERE o.order_number = 'SO-TEST-DELIVER1'
UNION ALL
SELECT o.id, 9103, 'Friteuse à Air Chaud AF-925', 'AF-925', 1, 0, 0,
       NOW(), NOW(), 'fr', left('toi' || o.id || 'h', 24)
FROM shop_order o WHERE o.order_number = 'SO-TEST-COUNTER2';

COMMIT;

SELECT order_number, status, pickup_code
FROM shop_order
WHERE order_number LIKE 'SO-TEST-%'
ORDER BY order_number;

DROP TABLE IF EXISTS resource CASCADE;
DROP TABLE IF EXISTS rental_resource CASCADE;

SELECT 1;

-- 7. Mettre à jour tous les voyages sans crafter ni chauffeur avec des valeurs par défaut
UPDATE voyage
SET crafter_id = (SELECT MIN(id) FROM crafter)
WHERE crafter_id IS NULL;

UPDATE voyage
SET chauffeur_id = (SELECT MIN(id) FROM chauffeur)
WHERE chauffeur_id IS NULL;


UPDATE voyage
SET type_voyage = 'NATIONAL'
WHERE type_voyage IS NULL;

-- =============================================================================
-- One-time data seed: Mobile Money tariffs (MVola, Orange, Airtel)
-- data.sql runs on every startup (spring.sql.init.mode=always), so this guard
-- table + timestamp check prevents the seed from being re-inserted on next runs.
-- =============================================================================
CREATE TABLE IF NOT EXISTS data_migration_log
(
    script_name VARCHAR(100) PRIMARY KEY,
    executed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM data_migration_log WHERE script_name = 'tariffrais_mobile_money_seed') THEN

            INSERT INTO public.tarif_mobile_money (min_amount, max_amount, frais_retrait, frais_transfert, operator_name, document_id, locale, created_at, published_at)
            VALUES (100.00, 1000.00, 100.00, 70.00, 'MVOLA', '65trw4f99xajhnhfnmq4ldcl', 'mg', NOW(), NOW()),
                   (1001.00, 5000.00, 150.00, 70.00, 'MVOLA', '1lrvc15tw8kesew8h7p66nri', 'mg', NOW(), NOW()),
                   (5001.00, 10000.00, 275.00, 150.00, 'MVOLA', 'weatd3kc878iplp33li32a03', 'mg', NOW(), NOW()),
                   (10001.00, 20000.00, 550.00, 250.00, 'MVOLA', 'yix4v0qkiyz9lflf4rhebnro', 'mg', NOW(), NOW()),
                   (10001.00, 25000.00, 650.00, 250.00, 'MVOLA', 'qn3tgzqztdl54ri7mh0ybfd0', 'mg', NOW(), NOW()),
                   (20001.00, 25000.00, 650.00, 250.00, 'MVOLA', '6c0anbcw9oxswpse3hpwj4hh', 'mg', NOW(), NOW()),
                   (25001.00, 50000.00, 1300.00, 500.00, 'MVOLA', 'uncp4nm0f3b24wamj8eb7hb0', 'mg', NOW(), NOW()),
                   (50001.00, 100000.00, 1900.00, 1000.00, 'MVOLA', '57e1w2pqme7t4i0122f94j69', 'mg', NOW(), NOW()),
                   (100001.00, 250000.00, 3400.00, 1900.00, 'MVOLA', 'lqumxmr9mx3id4nq21qo4gj0', 'mg', NOW(), NOW()),
                   (250001.00, 500000.00, 4700.00, 1900.00, 'MVOLA', 'l9fsipf3qyr85knjkx2isi40', 'mg', NOW(), NOW()),
                   (500001.00, 1000000.00, 8800.00, 3200.00, 'MVOLA', '26piord9jm6eudchntg1s9z7', 'mg', NOW(), NOW()),
                   (1000001.00, 2000000.00, 14700.00, 3800.00, 'MVOLA', 'n5olse2apxe6g7qwlwajza5f', 'mg', NOW(), NOW());

            INSERT INTO public.tarif_mobile_money (min_amount, max_amount, frais_retrait, frais_transfert, operator_name, document_id, locale, created_at, published_at)
            VALUES (200.00, 1000.00, 100.00, 65.00, 'ORANGE', '0is5b2bza3yg52whh44oco6k', 'mg', NOW(), NOW()),
                   (1001.00, 5000.00, 150.00, 65.00, 'ORANGE', '5p4knqssue8j3f2g0kmt5ns3', 'mg', NOW(), NOW()),
                   (5001.00, 10000.00, 275.00, 150.00, 'ORANGE', 'ik9mrwy34yti430aoym42lj9', 'mg', NOW(), NOW()),
                   (10001.00, 20000.00, 550.00, 250.00, 'ORANGE', 'y31lo06smprwd1tlo1ucty99', 'mg', NOW(), NOW()),
                   (20001.00, 25000.00, 650.00, 250.00, 'ORANGE', 'v61mzz4v4xqebfkhmfnzkkhy', 'mg', NOW(), NOW()),
                   (25001.00, 50000.00, 1300.00, 500.00, 'ORANGE', 'p2sxlc2phv7g6fp553qvpet6', 'mg', NOW(), NOW()),
                   (50001.00, 100000.00, 1900.00, 1000.00, 'ORANGE', 'xc355x2pbov0bc7qvp7qfqa2', 'mg', NOW(), NOW()),
                   (100001.00, 250000.00, 3400.00, 1900.00, 'ORANGE', 'vhar8tj1wwj8oiibksgujg88', 'mg', NOW(), NOW()),
                   (250001.00, 500000.00, 4700.00, 1900.00, 'ORANGE', 'cwqzprszp1g0134owjcny3vb', 'mg', NOW(), NOW()),
                   (500001.00, 1000000.00, 8800.00, 3200.00, 'ORANGE', '2m11a67rqcx0515oovb9tvhx', 'mg', NOW(), NOW()),
                   (1000001.00, 2000000.00, 14700.00, 3800.00, 'ORANGE', 'tq05wohih6nd316tcbgmzafw', 'mg', NOW(), NOW());

            INSERT INTO public.tarif_mobile_money (min_amount, max_amount, frais_retrait, frais_transfert, operator_name, document_id, locale, created_at, published_at)
            VALUES (100.00, 1000.00, 100.00, 50.00, 'AIRTEL', '4xz20cw38ulm7ua7g5fuwfuy', 'mg', NOW(), NOW()),
                   (1000.00, 5000.00, 140.00, 50.00, 'AIRTEL', 'fnxm1atnitutbq5qan4ioshu', 'mg', NOW(), NOW()),
                   (5001.00, 10000.00, 275.00, 100.00, 'AIRTEL', 'hycrb40kohesa3u2fnigy5v8', 'mg', NOW(), NOW()),
                   (10001.00, 20000.00, 550.00, 200.00, 'AIRTEL', 'hu6tdk59z0a7vik6hzc4jxkq', 'mg', NOW(), NOW()),
                   (20001.00, 25000.00, 650.00, 300.00, 'AIRTEL', '0r93say62y5z38m9g3il3hzi', 'mg', NOW(), NOW()),
                   (25001.00, 30000.00, 1300.00, 300.00, 'AIRTEL', '6t84oj198pv405igj94yyp4c', 'mg', NOW(), NOW()),
                   (30001.00, 40000.00, 1300.00, 400.00, 'AIRTEL', '1os8urxqvs4f6w8qw0g8nyaf', 'mg', NOW(), NOW()),
                   (40001.00, 50000.00, 1300.00, 600.00, 'AIRTEL', 'j40kajjb0p1oxj8q00eyvbew', 'mg', NOW(), NOW()),
                   (50001.00, 60000.00, 1900.00, 600.00, 'AIRTEL', 's6vgwubshtef744rajgwkzp0', 'mg', NOW(), NOW()),
                   (60001.00, 80000.00, 1900.00, 800.00, 'AIRTEL', 'ai21euain8t91x09ffhf3fzd', 'mg', NOW(), NOW()),
                   (80001.00, 100000.00, 1900.00, 800.00, 'AIRTEL', '0hccd88oqix1n856llohailo', 'mg', NOW(), NOW()),
                   (100001.00, 150000.00, 3400.00, 1500.00, 'AIRTEL', 'loqs9o1qpe63vqngj877zfii', 'mg', NOW(), NOW()),
                   (150001.00, 250000.00, 3400.00, 1500.00, 'AIRTEL', 'sa0nfg4d8pnb110ld8j10wr2', 'mg', NOW(), NOW()),
                   (250001.00, 500000.00, 4700.00, 1500.00, 'AIRTEL', '08sq128jwj3jp6ixkupbamol', 'mg', NOW(), NOW()),
                   (500001.00, 1000000.00, 8800.00, 2500.00, 'AIRTEL', '57zmw47tyfq09y2ibbdcn5j8', 'mg', NOW(), NOW()),
                   (1000001.00, 2000000.00, 14700.00, 3000.00, 'AIRTEL', 'vu3jpif7fpprl2zrnoyexmsl', 'mg', NOW(), NOW());

            INSERT INTO data_migration_log (script_name, executed_at) VALUES ('tariffrais_mobile_money_seed', NOW());
        END IF;
    END
$$;

-- =============================================================================
-- One-time data seed: Mobile Money transaction fees (frais_transaction)
-- =============================================================================
DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM data_migration_log WHERE script_name = 'frais_transaction_seed') THEN

            INSERT INTO public.frais_transaction (operator_name, pourcentage, document_id, locale, created_at, published_at)
            VALUES ('MVOLA', 1.50, 'mvola0000000000000000001', 'mg', NOW(), NOW()),
                   ('ORANGE', 1.00, 'orange000000000000000001', 'mg', NOW(), NOW()),
                   ('AIRTEL', 1.00, 'airtel000000000000000001', 'mg', NOW(), NOW());

            INSERT INTO data_migration_log (script_name, executed_at) VALUES ('frais_transaction_seed', NOW());
        END IF;
    END
$$;

-- =============================================================================
-- One-time data seed: Commission tiers for each existing koperative
-- Tiers: 0 - 99 999 (5 000 fee) and 100 000 - 500 000 (10 000 fee)
-- Dynamically inserted for every row currently in the koperative table.
-- =============================================================================
DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM data_migration_log WHERE script_name = 'commission_seed') THEN

            INSERT INTO public.commission (min_amount, max_amount, frais, koperative_id, document_id, locale, created_at, published_at)
            SELECT tier.min_amount,
                   tier.max_amount,
                   tier.frais,
                   k.id,
                   substr(md5(k.id::text || tier.min_amount::text), 1, 24),
                   'mg',
                   NOW(),
                   NOW()
            FROM koperative k
                     CROSS JOIN (VALUES (0.00::numeric, 99999.00::numeric, 5000.00::numeric),
                                        (100000.00::numeric, 500000.00::numeric, 10000.00::numeric)) AS tier(min_amount, max_amount, frais);

            INSERT INTO data_migration_log (script_name, executed_at) VALUES ('commission_seed', NOW());
        END IF;
    END
$$;

-- =============================================================================
-- One-time data seed: Tombana Fanaterana (estimated delivery rates)
-- =============================================================================
DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM data_migration_log WHERE script_name = 'tombana_fanaterana_seed') THEN

            INSERT INTO public.tombana_fanaterana (min_weight, max_weight, frais, delivery_method, ville_id, document_id, locale, created_at, published_at)
            SELECT weight_tier.min_weight,
                   weight_tier.max_weight,
                   weight_tier.frais,
                   'STANDARD',
                   v.id,
                   substr(md5(v.id::text || weight_tier.min_weight::text), 1, 24),
                   'mg',
                   NOW(),
                   NOW()
            FROM ville v
                     CROSS JOIN (VALUES (0.00::numeric, 5.00::numeric, 5000.00::numeric),
                                        (5.01::numeric, 20.00::numeric, 15000.00::numeric),
                                        (20.01::numeric, 100.00::numeric, 30000.00::numeric)) AS weight_tier(min_weight, max_weight, frais);

            INSERT INTO data_migration_log (script_name, executed_at) VALUES ('tombana_fanaterana_seed', NOW());
        END IF;
    END
$$;
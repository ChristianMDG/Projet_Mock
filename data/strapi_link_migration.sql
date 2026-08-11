-- =====================================================
-- Strapi Link Tables Migration
-- Populates Strapi relation link tables from Spring Boot FK columns
-- Run via: docker exec taxibrousse-postgres psql -U taxibrousse -d taxibrousse -f /tmp/strapi_link_migration.sql
-- =====================================================

BEGIN;

-- -----------------------------------------------
-- 1. Copy koperative (Spring Boot) → koperatives (Strapi)
--    Same IDs, generate document_id where missing
-- -----------------------------------------------
INSERT INTO koperatives (
  id, document_id, name, description, address, phone, email,
  registration_number, tax_id, website, logo_url, status,
  proprietaire_id, created_at, updated_at
)
SELECT
  k.id::integer,
  COALESCE(k.document_id, md5(random()::text || k.id::text)),
  k.name,
  k.description,
  k.address,
  k.phone,
  k.email,
  k.registration_number,
  k.tax_id,
  k.website,
  k.logo_url,
  k.status,
  k.proprietaire_id::integer,
  COALESCE(k.created_at, now()),
  COALESCE(k.updated_at, now())
FROM koperative k
ON CONFLICT (id) DO NOTHING;

-- Update sequence to avoid future ID conflicts
SELECT setval('koperatives_id_seq', (SELECT MAX(id) + 1 FROM koperatives));

-- -----------------------------------------------
-- 2. koperative ↔ ville (ManyToMany)
-- -----------------------------------------------
INSERT INTO koperatives_villes_lnk (koperative_id, ville_id)
SELECT kv.koperative_id::integer, kv.villes_id
FROM koperative_ville kv
WHERE EXISTS (SELECT 1 FROM koperatives k WHERE k.id = kv.koperative_id::integer)
  AND EXISTS (SELECT 1 FROM ville v WHERE v.id = kv.villes_id)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 3. voyage relations
-- -----------------------------------------------
INSERT INTO voyage_chauffeur_lnk (voyage_id, chauffeur_id)
SELECT v.id, v.chauffeur_id
FROM voyage v
WHERE v.chauffeur_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO voyage_route_lnk (voyage_id, route_id)
SELECT v.id, v.route_id
FROM voyage v
WHERE v.route_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO voyage_koperative_lnk (voyage_id, koperative_id)
SELECT v.id, v.koperative_id::integer
FROM voyage v
WHERE v.koperative_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM koperatives k WHERE k.id = v.koperative_id::integer)
ON CONFLICT DO NOTHING;

INSERT INTO voyage_departure_gare_lnk (voyage_id, gare_id)
SELECT v.id, v.departure_gare_id
FROM voyage v
WHERE v.departure_gare_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO voyage_arrival_gare_lnk (voyage_id, gare_id)
SELECT v.id, v.arrival_gare_id
FROM voyage v
WHERE v.arrival_gare_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO voyage_crafter_lnk (voyage_id, crafter_id)
SELECT v.id, v.crafter_id
FROM voyage v
WHERE v.crafter_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO voyage_classe_lnk (voyage_id, classe_id)
SELECT v.id, v.classe_id
FROM voyage v
WHERE v.classe_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- parentTemplate: voyage_id = child, inv_voyage_id = parent template
INSERT INTO voyage_parent_template_lnk (voyage_id, inv_voyage_id)
SELECT v.id, v.parent_template_id
FROM voyage v
WHERE v.parent_template_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 4. reservation relations
-- -----------------------------------------------
INSERT INTO reservation_voyage_lnk (reservation_id, voyage_id)
SELECT r.id, r.voyage_id
FROM reservation r
WHERE r.voyage_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO reservation_classe_lnk (reservation_id, classe_id)
SELECT r.id, r.classe_id
FROM reservation r
WHERE r.classe_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 5. facturation ↔ reservation (oneToOne)
-- -----------------------------------------------
INSERT INTO facturation_reservation_lnk (facturation_id, reservation_id)
SELECT f.id, f.reservation_id
FROM facturation f
WHERE f.reservation_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 6. seat relations
-- -----------------------------------------------
INSERT INTO seat_voyage_lnk (seat_id, voyage_id)
SELECT s.id, s.voyage_id
FROM seat s
WHERE s.voyage_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO seat_crafter_lnk (seat_id, crafter_id)
SELECT s.id, s.crafter_id
FROM seat s
WHERE s.crafter_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO seat_reservation_lnk (seat_id, reservation_id)
SELECT s.id, s.reservation_id
FROM seat s
WHERE s.reservation_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 7. gare → ville
-- -----------------------------------------------
INSERT INTO gare_ville_lnk (gare_id, ville_id)
SELECT g.id, g.ville_id
FROM gare g
WHERE g.ville_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 8. hotel → ville
-- -----------------------------------------------
INSERT INTO hotel_ville_lnk (hotel_id, ville_id)
SELECT h.id, h.ville_id
FROM hotel h
WHERE h.ville_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 9. guichet relations
-- -----------------------------------------------
INSERT INTO guichet_gare_lnk (guichet_id, gare_id)
SELECT g.id, g.gare_id
FROM guichet g
WHERE g.gare_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO guichet_koperative_lnk (guichet_id, koperative_id)
SELECT g.id, g.koperative_id::integer
FROM guichet g
WHERE g.koperative_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM koperatives k WHERE k.id = g.koperative_id::integer)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 10. chauffeur → koperative
-- -----------------------------------------------
INSERT INTO chauffeur_koperative_lnk (chauffeur_id, koperative_id)
SELECT c.id, c.koperative_id::integer
FROM chauffeur c
WHERE c.koperative_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM koperatives k WHERE k.id = c.koperative_id::integer)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 11. crafter relations
-- -----------------------------------------------
INSERT INTO crafter_chauffeur_lnk (crafter_id, chauffeur_id)
SELECT c.id, c.chauffeur_id
FROM crafter c
WHERE c.chauffeur_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO crafter_koperative_lnk (crafter_id, koperative_id)
SELECT c.id, c.koperative_id::integer
FROM crafter c
WHERE c.koperative_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM koperatives k WHERE k.id = c.koperative_id::integer)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 12. moto → chauffeur
-- -----------------------------------------------
INSERT INTO moto_chauffeur_lnk (moto_id, chauffeur_id)
SELECT m.id, m.chauffeur_id
FROM moto m
WHERE m.chauffeur_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 13. colis relations
-- -----------------------------------------------
INSERT INTO colis_crafter_lnk (colis_id, crafter_id)
SELECT c.id, c.crafter_id
FROM colis c
WHERE c.crafter_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO colis_reservation_lnk (colis_id, reservation_id)
SELECT c.id, c.reservation_id
FROM colis c
WHERE c.reservation_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO colis_voyage_lnk (colis_id, voyage_id)
SELECT c.id, c.voyage_id
FROM colis c
WHERE c.voyage_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 14. contrat relations
-- -----------------------------------------------
INSERT INTO contrat_chauffeur_lnk (contrat_id, chauffeur_id)
SELECT ct.id, ct.chauffeur_id
FROM contrat ct
WHERE ct.chauffeur_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO contrat_koperative_lnk (contrat_id, koperative_id)
SELECT ct.id, ct.koperative_id::integer
FROM contrat ct
WHERE ct.koperative_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM koperatives k WHERE k.id = ct.koperative_id::integer)
ON CONFLICT DO NOTHING;

INSERT INTO contrat_partenaire_lnk (contrat_id, partenaire_id)
SELECT ct.id, ct.partenaire_id
FROM contrat ct
WHERE ct.partenaire_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- 15. route relations
-- -----------------------------------------------
INSERT INTO route_departure_gare_lnk (route_id, gare_id)
SELECT r.id, r.departure_gare_id
FROM route r
WHERE r.departure_gare_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO route_arrival_gare_lnk (route_id, gare_id)
SELECT r.id, r.arrival_gare_id
FROM route r
WHERE r.arrival_gare_id IS NOT NULL
ON CONFLICT DO NOTHING;

COMMIT;

-- -----------------------------------------------
-- Verification summary
-- -----------------------------------------------
SELECT 'koperatives' as tbl, COUNT(*) FROM koperatives
UNION ALL SELECT 'koperatives_villes_lnk', COUNT(*) FROM koperatives_villes_lnk
UNION ALL SELECT 'voyage_chauffeur_lnk', COUNT(*) FROM voyage_chauffeur_lnk
UNION ALL SELECT 'voyage_route_lnk', COUNT(*) FROM voyage_route_lnk
UNION ALL SELECT 'voyage_koperative_lnk', COUNT(*) FROM voyage_koperative_lnk
UNION ALL SELECT 'voyage_departure_gare_lnk', COUNT(*) FROM voyage_departure_gare_lnk
UNION ALL SELECT 'voyage_arrival_gare_lnk', COUNT(*) FROM voyage_arrival_gare_lnk
UNION ALL SELECT 'voyage_crafter_lnk', COUNT(*) FROM voyage_crafter_lnk
UNION ALL SELECT 'voyage_classe_lnk', COUNT(*) FROM voyage_classe_lnk
UNION ALL SELECT 'voyage_parent_template_lnk', COUNT(*) FROM voyage_parent_template_lnk
UNION ALL SELECT 'reservation_voyage_lnk', COUNT(*) FROM reservation_voyage_lnk
UNION ALL SELECT 'reservation_classe_lnk', COUNT(*) FROM reservation_classe_lnk
UNION ALL SELECT 'facturation_reservation_lnk', COUNT(*) FROM facturation_reservation_lnk
UNION ALL SELECT 'seat_voyage_lnk', COUNT(*) FROM seat_voyage_lnk
UNION ALL SELECT 'seat_crafter_lnk', COUNT(*) FROM seat_crafter_lnk
UNION ALL SELECT 'seat_reservation_lnk', COUNT(*) FROM seat_reservation_lnk
UNION ALL SELECT 'gare_ville_lnk', COUNT(*) FROM gare_ville_lnk
UNION ALL SELECT 'hotel_ville_lnk', COUNT(*) FROM hotel_ville_lnk
UNION ALL SELECT 'guichet_gare_lnk', COUNT(*) FROM guichet_gare_lnk
UNION ALL SELECT 'guichet_koperative_lnk', COUNT(*) FROM guichet_koperative_lnk
UNION ALL SELECT 'chauffeur_koperative_lnk', COUNT(*) FROM chauffeur_koperative_lnk
UNION ALL SELECT 'crafter_chauffeur_lnk', COUNT(*) FROM crafter_chauffeur_lnk
UNION ALL SELECT 'crafter_koperative_lnk', COUNT(*) FROM crafter_koperative_lnk
UNION ALL SELECT 'moto_chauffeur_lnk', COUNT(*) FROM moto_chauffeur_lnk
UNION ALL SELECT 'colis_crafter_lnk', COUNT(*) FROM colis_crafter_lnk
UNION ALL SELECT 'colis_reservation_lnk', COUNT(*) FROM colis_reservation_lnk
UNION ALL SELECT 'colis_voyage_lnk', COUNT(*) FROM colis_voyage_lnk
UNION ALL SELECT 'contrat_chauffeur_lnk', COUNT(*) FROM contrat_chauffeur_lnk
UNION ALL SELECT 'contrat_koperative_lnk', COUNT(*) FROM contrat_koperative_lnk
UNION ALL SELECT 'contrat_partenaire_lnk', COUNT(*) FROM contrat_partenaire_lnk
UNION ALL SELECT 'route_departure_gare_lnk', COUNT(*) FROM route_departure_gare_lnk
UNION ALL SELECT 'route_arrival_gare_lnk', COUNT(*) FROM route_arrival_gare_lnk
ORDER BY 1;

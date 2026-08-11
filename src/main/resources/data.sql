SELECT 1;

-- Script SQL pour mettre à jour la colonne status de la table koperative
-- Basé sur la définition réelle de la table avec une contrainte CHECK

-- 1. Supprimer l'ancienne contrainte CHECK
ALTER TABLE koperative DROP CONSTRAINT IF EXISTS koperative_status_check;

-- 2. Ajouter la nouvelle contrainte CHECK incluant 'CONFIRMED'
ALTER TABLE koperative
    ADD CONSTRAINT koperative_status_check
        CHECK ((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying, 'SUSPENDED'::character varying, 'CONFIRMED'::character varying])::text[]));

-- 3. (Optionnel) Mettre à jour les enregistrements existants si nécessaire
-- UPDATE koperative SET status = 'CONFIRMED' WHERE status IS NULL;

-- 4. Mettre à jour la colonne idNumber dans la table userinfo pour permettre les valeurs nulles
ALTER TABLE userinfo ALTER COLUMN id_number DROP NOT NULL;

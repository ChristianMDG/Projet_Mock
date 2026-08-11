/*
-- Original data - commented out
8,Gare Routiere: Antananarivo-I
9,Gare Routiere: Antananarivo-II
10,Gare Routiere: Antananarivo-III
11,Gare Routiere: Antananarivo-IV
12,Gare Routiere: Antananarivo-V
13,Gare Routiere: Antananarivo-VI


111,Gare Routiere: TOLIARY I
112,Gare Routiere: TOLIARY II

28,Gare Routiere: ANTSIRANANA I
29,Gare Routiere: ANTSIRANANA II

21,Gare Routiere: ANTSIRABE I
22,Gare Routiere: ANTSIRABE II


and delete route using gare here, and should delete these gares
142,Gare Routiere: amboromalandy
146,Gare Routiere: ambovondramanesy
141,Gare Routiere: andranofasika
145,Gare Routiere: andranolava
138,Gare Routiere: andranomamy
143,Gare Routiere: anjiajia
137,Gare Routiere: antanimbary
144,Gare Routiere: croisement anjiajia
140,Gare Routiere: tsaramandroso
135,Gare routier: Andriba
134,Gare routier: ampanefena
*/

-- GARE CONSOLIDATION AND CLEANUP SCRIPT
-- This script consolidates multiple gares per city into single main gares
-- and cleans up unused small town gares
-- Based on JPA entities: GareEntity, RouteEntity, ContratEntity, VoyageEntity, GuichetEntity

DO $$
    DECLARE
        rowcount integer;
    BEGIN
        RAISE NOTICE 'Starting gare consolidation process...';

-- 1. ANTANANARIVO: Consolidate gares 5,6,9,10,11,12,13 into gare 8
        RAISE NOTICE 'Consolidating ANTANANARIVO gares...';

        -- Update route references (based on RouteEntity with departure_gare_id, arrival_gare_id)
        UPDATE route SET departure_gare_id = 8 WHERE departure_gare_id IN (5,6,9,10,11,12,13);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Updated % route departure references for ANTANANARIVO', rowcount;

        UPDATE route SET arrival_gare_id = 8 WHERE arrival_gare_id IN (5,6,9,10,11,12,13);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Updated % route arrival references for ANTANANARIVO', rowcount;

        -- Update voyage references (based on VoyageEntity)
        UPDATE voyage SET departure_gare_id = 8 WHERE departure_gare_id IN (5,6,9,10,11,12,13);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Updated % voyage departure references for ANTANANARIVO', rowcount;

        UPDATE voyage SET arrival_gare_id = 8 WHERE arrival_gare_id IN (5,6,9,10,11,12,13);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Updated % voyage arrival references for ANTANANARIVO', rowcount;

        -- Update guichet references (based on GuichetEntity.gare)
        UPDATE guichet SET gare_id = 8 WHERE gare_id IN (5,6,9,10,11,12,13);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Updated % guichet references for ANTANANARIVO', rowcount;

        -- Update guichet_destinations many-to-many table
        UPDATE guichet_destinations SET gare_id = 8 WHERE gare_id IN (5,6,9,10,11,12,13);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Updated % guichet destination references for ANTANANARIVO', rowcount;

        -- Rename main gare (based on GareEntity.name)
        UPDATE gare SET name = 'Gare Routiere: ANTANANARIVO', updated_at = NOW() WHERE id = 8;

        -- Delete unused gares
        DELETE FROM gare WHERE id IN (5,6,9,10,11,12,13);
        RAISE NOTICE 'Deleted ANTANANARIVO duplicate gares (5,6,9-13)';

        -- 2. TOLIARY: Consolidate gare 112 into 111
        RAISE NOTICE 'Consolidating TOLIARY gares...';

        UPDATE route SET departure_gare_id = 111 WHERE departure_gare_id = 112;
        UPDATE route SET arrival_gare_id = 111 WHERE arrival_gare_id = 112;
        UPDATE voyage SET departure_gare_id = 111 WHERE departure_gare_id = 112;
        UPDATE voyage SET arrival_gare_id = 111 WHERE arrival_gare_id = 112;
        UPDATE guichet SET gare_id = 111 WHERE gare_id = 112;
        UPDATE guichet_destinations SET gare_id = 111 WHERE gare_id = 112;
        UPDATE gare SET name = 'Gare Routiere: TOLIARY', updated_at = NOW() WHERE id = 111;
        DELETE FROM gare WHERE id = 112;
        RAISE NOTICE 'Consolidated TOLIARY gares';

        -- 3. ANTSIRANANA: Consolidate gare 29 into 28
        RAISE NOTICE 'Consolidating ANTSIRANANA gares...';

        UPDATE route SET departure_gare_id = 28 WHERE departure_gare_id = 29;
        UPDATE route SET arrival_gare_id = 28 WHERE arrival_gare_id = 29;
        UPDATE voyage SET departure_gare_id = 28 WHERE departure_gare_id = 29;
        UPDATE voyage SET arrival_gare_id = 28 WHERE arrival_gare_id = 29;
        UPDATE guichet SET gare_id = 28 WHERE gare_id = 29;
        UPDATE guichet_destinations SET gare_id = 28 WHERE gare_id = 29;
        UPDATE gare SET name = 'Gare Routiere: ANTSIRANANA', updated_at = NOW() WHERE id = 28;
        DELETE FROM gare WHERE id = 29;
        RAISE NOTICE 'Consolidated ANTSIRANANA gares';

        -- 4. ANTSIRABE: Consolidate gare 22 into 21
        RAISE NOTICE 'Consolidating ANTSIRABE gares...';

        UPDATE route SET departure_gare_id = 21 WHERE departure_gare_id = 22;
        UPDATE route SET arrival_gare_id = 21 WHERE arrival_gare_id = 22;
        UPDATE voyage SET departure_gare_id = 21 WHERE departure_gare_id = 22;
        UPDATE voyage SET arrival_gare_id = 21 WHERE arrival_gare_id = 22;
        UPDATE guichet SET gare_id = 21 WHERE gare_id = 22;
        UPDATE guichet_destinations SET gare_id = 21 WHERE gare_id = 22;
        UPDATE gare SET name = 'Gare Routiere: ANTSIRABE', updated_at = NOW() WHERE id = 21;
        DELETE FROM gare WHERE id = 22;
        RAISE NOTICE 'Consolidated ANTSIRABE gares';

        -- 5. DELETE VILLES AND ALL RELATED DATA
        RAISE NOTICE 'Cleaning up villes and their related data...';

        -- First, get all gare IDs that belong to these villes
        RAISE NOTICE 'Finding gares belonging to villes to delete...';

        -- Delete guichet_destinations references for gares in these villes
        DELETE FROM guichet_destinations WHERE gare_id IN (
            SELECT id FROM gare WHERE ville_id IN (1,3,4,7,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147)
        );
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % guichet destination references for ville-based gares', rowcount;

        -- Delete guichets belonging to gares in these villes
        DELETE FROM guichet WHERE gare_id IN (
            SELECT id FROM gare WHERE ville_id IN (1,3,4,7,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147)
        );
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % guichets for ville-based gares', rowcount;

        -- Delete voyage departure references for gares in these villes
        DELETE FROM voyage WHERE departure_gare_id IN (
            SELECT id FROM gare WHERE ville_id IN (1,3,4,7,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147)
        );
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % voyage departures for ville-based gares', rowcount;

        -- Delete voyage arrival references for gares in these villes
        DELETE FROM voyage WHERE arrival_gare_id IN (
            SELECT id FROM gare WHERE ville_id IN (1,3,4,7,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147)
        );
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % voyage arrivals for ville-based gares', rowcount;

        -- Delete route departure references for gares in these villes
        DELETE FROM route WHERE departure_gare_id IN (
            SELECT id FROM gare WHERE ville_id IN (1,3,4,7,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147)
        );
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % route departures for ville-based gares', rowcount;

        -- Delete route arrival references for gares in these villes
        DELETE FROM route WHERE arrival_gare_id IN (
            SELECT id FROM gare WHERE ville_id IN (1,3,4,7,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147)
        );
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % route arrivals for ville-based gares', rowcount;

        -- Delete gares belonging to these villes
        DELETE FROM gare WHERE ville_id IN (1,3,4,7,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % gares belonging to target villes', rowcount;

        -- Delete koperative_ville junction table references
        DELETE FROM koperative_ville WHERE villes_id IN (1,2,3,4,7,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % koperative_ville references', rowcount;

        -- Finally delete the villes themselves
        DELETE FROM ville WHERE id IN (1,2,3,4,7,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % villes', rowcount;

        -- 6. DELETE REMAINING SMALL TOWN GARES AND CLEANUP
        RAISE NOTICE 'Cleaning up remaining small town gares...';
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % guichet destination references for small towns', rowcount;

        -- Delete guichets using these gares
        DELETE FROM guichet WHERE gare_id IN (1,2,3,4,7,134,135,136,137,138,140,141,142,143,144,145,146);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % guichets for small towns', rowcount;

        -- Delete voyage departure references
        DELETE FROM voyage WHERE departure_gare_id IN (1,2,3,4,7,134,135,136,137,138,140,141,142,143,144,145,146);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % voyage departures for small towns', rowcount;

        -- Delete voyage arrival references
        DELETE FROM voyage WHERE arrival_gare_id IN (1,2,3,4,7,134,135,136,137,138,140,141,142,143,144,145,146);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % voyage arrivals for small towns', rowcount;

        -- Delete route departure references
        DELETE FROM route WHERE departure_gare_id IN (1,2,3,4,7,134,135,136,137,138,140,141,142,143,144,145,146);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % route departures for small towns', rowcount;

        -- Delete route arrival references
        DELETE FROM route WHERE arrival_gare_id IN (1,2,3,4,7,134,135,136,137,138,140,141,142,143,144,145,146);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % route arrivals for small towns', rowcount;

        -- Finally delete the unused small town gares
        DELETE FROM gare WHERE id IN (1,2,3,4,7,134,135,136,137,138,140,141,142,143,144,145,146);
        GET DIAGNOSTICS rowcount = ROW_COUNT;
        RAISE NOTICE 'Deleted % small town gares', rowcount;

        RAISE NOTICE 'Gare consolidation completed successfully!';

    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error during gare consolidation: %', SQLERRM;
    END $$;


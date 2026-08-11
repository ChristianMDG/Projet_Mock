CREATE OR REPLACE PROCEDURE pop_routes()
LANGUAGE sql
AS $$
INSERT INTO public.route (
    name,
    description,
    departure_gare_id,
    arrival_gare_id,
    distance_km,
    estimated_duration_hours,
    frais_taxibrousse,
    frais_koperative,
    frequence,
    is_active,
    created_at,
    updated_at,
    document_id
)
SELECT DISTINCT ON (v_dep.name, v_arr.name)
    v_dep.name || ' - ' || v_arr.name,
    lo_from_bytea(0, (v_dep.name || ' - ' || v_arr.name)::bytea),
    g_dep.id,
    g_arr.id,
    0,
    0,
    0,
    0,
    0,
    true,
    NOW(),
    NOW(),
    substring(md5(random()::text), 1, 12)
FROM public.gare g_dep
JOIN public.ville v_dep ON g_dep.ville_id = v_dep.id
CROSS JOIN public.gare g_arr
JOIN public.ville v_arr ON g_arr.ville_id = v_arr.id
WHERE v_dep.id != v_arr.id
  AND v_dep.is_active = true
  AND v_arr.is_active = true
  AND g_dep.is_closed = false
  AND g_arr.is_closed = false
ORDER BY v_dep.name, v_arr.name, g_dep.id, g_arr.id
ON CONFLICT (name) DO NOTHING;
$$;

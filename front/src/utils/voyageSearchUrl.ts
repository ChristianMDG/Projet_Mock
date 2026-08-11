export interface VoyageSearchUrlParams {
  fromVilleName?: string | null;
  toVilleName?: string | null;
  departureDate?: string | null;
  passengers?: number | null;
  koperativeId?: number | null;
}

export interface VoyageSearchUrlMapping {
  from: string;
  to: string;
  date: string;
  pax: string;
  k: string;
}

function toPositiveInt(value: string | null): number | null {
  const parsed = value ? Number.parseInt(value, 10) : NaN;
  const isValid = Number.isFinite(parsed) && parsed > 0;
  return isValid ? parsed : null;
}

export function buildVoyageSearchQuery(params: VoyageSearchUrlParams, mapping: VoyageSearchUrlMapping): string {
  const search = new URLSearchParams();

  if (params.fromVilleName) search.set(mapping.from, params.fromVilleName);
  if (params.toVilleName) search.set(mapping.to, params.toVilleName);
  if (params.departureDate) search.set(mapping.date, params.departureDate);
  if (params.passengers && params.passengers > 0) search.set(mapping.pax, String(params.passengers));
  if (params.koperativeId) search.set(mapping.k, String(params.koperativeId));

  const queryString = search.toString();
  return queryString && `?${queryString}`;
}

export function parseVoyageSearchQuery(
  searchParams: URLSearchParams,
  mapping: VoyageSearchUrlMapping,
): VoyageSearchUrlParams {
  const fromVilleName = searchParams.get(mapping.from);
  const toVilleName = searchParams.get(mapping.to);
  const dateRaw = searchParams.get(mapping.date);
  const isValidDate = dateRaw && /^\d{4}-\d{2}-\d{2}$/.test(dateRaw);
  const departureDate = isValidDate ? dateRaw : null;
  const passengers = toPositiveInt(searchParams.get(mapping.pax));
  const koperativeId = toPositiveInt(searchParams.get(mapping.k));

  return { fromVilleName, toVilleName, departureDate, passengers, koperativeId };
}

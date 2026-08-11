import api from './axios';
import type {
  Koperative,
  KoperativeCrafter,
  KoperativeGuichet,
  KoperativeChauffeur,
  GuichetWithKoperative,
  CreateKoperativePayload,
  AssignGarePayload,
} from '@/types/koperative.types';

const BASE = '/koperatives';
const GUICHET_BASE = '/guichets';

export const getKoperatives = async (): Promise<Koperative[]> => {
  const { data } = await api.get<Koperative[]>(BASE);
  return data;
};

export const getKoperativeById = async (id: number): Promise<Koperative> => {
  const { data } = await api.get<Koperative>(`${BASE}/${id}`);
  return data;
};

export const getKoperativeCrafters = async (id: number): Promise<KoperativeCrafter[]> => {
  const { data } = await api.get<KoperativeCrafter[]>(`${BASE}/${id}/crafters`);
  return data;
};

export const getKoperativeGuichets = async (id: number): Promise<KoperativeGuichet[]> => {
  const { data } = await api.get<KoperativeGuichet[]>(`${BASE}/${id}/guichets`);
  return data;
};

export const getKoperativeChauffeurs = async (id: number): Promise<KoperativeChauffeur[]> => {
  const { data } = await api.get<KoperativeChauffeur[]>(`${BASE}/${id}/chauffeurs`);
  return data;
};

export const countKoperatives = async (): Promise<number> => {
  const { data } = await api.get<number>(`${BASE}/count`);
  return data;
};

export const createKoperative = async (payload: CreateKoperativePayload): Promise<Koperative> => {
  const { data } = await api.post<Koperative>(BASE, payload);
  return data;
};

export const assignGareToKoperative = async ({ koperativeId, gareId }: AssignGarePayload): Promise<void> => {
  await api.post('/guichets', {
    koperative: { id: koperativeId },
    gare: { id: gareId },
    isActive: true,
  });
};

export const getGuichetsByGare = async (gareId: number): Promise<GuichetWithKoperative[]> => {
  const { data } = await api.get<GuichetWithKoperative[]>(`${GUICHET_BASE}/gare/${gareId}`);
  return data;
};

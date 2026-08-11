import axios from './axios';
import { Koperative } from '@/models/Koperative';
import { Ville } from '@/models/Ville';
import { Crafter } from '@/models/Crafter';
import { Guichet } from '@/models/Guichet';
import { Chauffeur } from '@/models/Chauffeur';
import { KoperativeFilter } from '@/types/type.util';

const API_URL = '/koperatives';

// Get koperatives by gareId - list all guichets for a specific gare

export const getKoperatives = async (filter?: Partial<KoperativeFilter>) => {
  const params: Record<string, string> = {};
  if (filter) {
    if (filter.ville && Array.isArray(filter.ville) && filter.ville.length > 0) {
      params.villeIds = filter.ville.map(v => v.id).join(',');
    }
    if (filter.name) {
      params.name = filter.name;
    }
    if (filter.top) {
      params.top = filter.top.toString();
    }
  }
  const { data } = await axios.get<Koperative[]>(API_URL, { params });
  return data;
};

export const countKoperatives = async () => {
  const { data } = await axios.get<number>(`${API_URL}/count`);
  return data;
};

export const getKoperative = async (id: number) => {
  const { data } = await axios.get<Koperative>(`${API_URL}/${id}`);
  return data;
};

export const createKoperative = async (koperative: Partial<Koperative>) => {
  const { data } = await axios.post<Koperative>(API_URL, koperative);
  return data;
};

export const updateKoperative = async (id: number, koperative: Partial<Koperative>) => {
  const { data } = await axios.put<Koperative>(`${API_URL}/${id}`, koperative);
  return data;
};

export const deleteKoperative = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};

export const getKoperativeVilles = async (id: number) => {
  const { data } = await axios.get<Ville[]>(`${API_URL}/${id}/villes`);
  return data;
};

export const updateKoperativeVilles = async (id: number, villes: Ville[]) => {
  const { data } = await axios.put<Koperative>(`${API_URL}/${id}/villes`, villes);
  return data;
};

export const getKoperativeCrafters = async (id: number) => {
  const { data } = await axios.get<Crafter[]>(`${API_URL}/${id}/crafters`);
  return data;
};

export const getKoperativeGuichets = async (id: number) => {
  const { data } = await axios.get<Guichet[]>(`${API_URL}/${id}/guichets`);
  return data;
};

export const getKoperativeChauffeurs = async (id: number) => {
  const { data } = await axios.get<Chauffeur[]>(`${API_URL}/${id}/chauffeurs`);
  return data;
};

export const updateKoperativeChauffeurs = async (id: number, chauffeurs: Chauffeur[]) => {
  const { data } = await axios.put<Koperative>(`${API_URL}/${id}/chauffeurs`, chauffeurs);
  return data;
};

export const getKoperativesByVoyageurId = async (voyageurId: number) => {
  const { data } = await axios.get<Koperative[]>(`${API_URL}/favorites/${voyageurId}`);
  return data;
};

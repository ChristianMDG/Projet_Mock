import axios from './axios';

export interface ResourceRow {
  id?: number;
  key: string;
  mg: string;
  fr: string;
  en: string;
}

export const getResources = async () => {
  const { data } = await axios.get<ResourceRow[]>('/resources');
  return data;
};

export const updateResource = async (id: number, resource: Omit<ResourceRow, 'id'>) => {
  const { data } = await axios.put<ResourceRow>(`/resources/${id}`, resource);
  return data;
};

export const addResource = async (resource: Omit<ResourceRow, 'id'>) => {
  const { data } = await axios.post<ResourceRow>('/resources', resource);
  return data;
};

export const deleteResource = async (id: number) => {
  await axios.delete(`/resources/${id}`);
};

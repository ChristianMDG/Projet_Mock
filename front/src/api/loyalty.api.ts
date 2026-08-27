import axios from './axios';

const API_URL = '/loyalty';

export interface LoyaltyView {
  voyageurId: number;
  kmEarned: number;
  kmRedeemed: number;
  kmAvailable: number;
  kmPerFreeVoyage: number;
  earnMultiplier: number;
  programActive: boolean;
  freeVoyagesAvailable: number;
  kmToNextFreeVoyage: number;
  /** Ratio between 0 and 1. */
  progressToNextFreeVoyage: number;
}

export interface LoyaltyConfig {
  id?: number;
  kmPerFreeVoyage: number;
  earnMultiplier: number;
  isActive: boolean;
}

export const getLoyaltyView = async (voyageurId: number): Promise<LoyaltyView> => {
  const { data } = await axios.get<LoyaltyView>(`${API_URL}/${voyageurId}`);
  return data;
};

export const getLoyaltyConfig = async (): Promise<LoyaltyConfig> => {
  const { data } = await axios.get<LoyaltyConfig>(`${API_URL}/config`);
  return data;
};

export const updateLoyaltyConfig = async (config: LoyaltyConfig): Promise<LoyaltyConfig> => {
  const { data } = await axios.put<LoyaltyConfig>(`${API_URL}/config`, config);
  return data;
};

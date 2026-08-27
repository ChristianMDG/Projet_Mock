export interface VoyageDescriptionDto {
  departureTimes: string;
  description: string;
  voyageIds: string;
  tags: string;
  departureDate: string; // ISO format (YYYY-MM-DD)
  koperativeId: number;
  gareId: number;
  classeId: number | null;
  koperativeName: string;
  departureVille: string;
  arrivalVille: string;
  gareName: string;
}

export interface FacebookScheduleRequest {
  voyageIds: string;
  description: string;
  scheduledTime: string; // ISO format (YYYY-MM-DDTHH:mm:ss)
  hashtags?: string;
  image?: File;
}

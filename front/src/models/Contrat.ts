import { Base } from '@/models/Base';
import { Partenaire } from '@/models/Partenaire';
import { Chauffeur } from '@/models/Chauffeur';
import { Koperative } from '@/models/Koperative';

export interface Contrat extends Base {
  partenaire?: Partenaire;
  chauffeur?: Chauffeur;
  koperative?: Koperative;
  type: string;
  title: string;
  terms?: string;
  startDate?: string;
  endDate?: string;
  contractValue?: number;
  status: string;
}

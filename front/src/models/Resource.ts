import { Base } from './Base';

export interface Resource extends Base {
  id?: number;
  key: string;
  fr: string;
  en: string;
  mg: string;
}

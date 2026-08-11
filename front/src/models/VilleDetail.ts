import { Base } from './Base';
import { StrapiMedia } from '@/types/cms.types';

export interface VilleDetail extends Base {
  Superficie?: number;
  Population?: number;
  Regions?: string;
  ImageGalery?: StrapiMedia[];
}

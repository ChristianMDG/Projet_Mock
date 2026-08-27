import { Base } from './Base';
import { Cloudinary } from './Cloudinary';

export type LanguagePreference = 'FR' | 'EN' | 'MG';

export interface Authority {
  id?: number;
  name: string;
}

export interface UserInfo extends Base {
  username: string;
  password?: string;
  admin?: boolean;
  authorities?: Authority[];
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
  address?: string;
  idNumber?: string;
  idType?: string; // CinTypeEnum
  isActive?: boolean;
  languagePreference?: LanguagePreference;
  photo?: Cloudinary;
  uploads?: Cloudinary[];
}

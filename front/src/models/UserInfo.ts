import { Cloudinary } from './Cloudinary';
import { UserAccount } from './UserAccount';

export type LanguagePreference = 'FR' | 'EN' | 'MG';

export interface UserInfo extends UserAccount {
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

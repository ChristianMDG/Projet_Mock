import type { UserOperator } from '@/models/UserOperator';
import type { CinTypeEnum } from '@/models/enums';

export interface AuthResponse {
  token: string;
  user?: UserOperator;
}

export interface UserAccountFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  idNumber: string;
  idType: CinTypeEnum;
  password: string;
  photo: { url: string; publicId: string } | null;
  isActive: boolean;
}

export interface UserFormData {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  idNumber: string;
}

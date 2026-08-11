export interface Voyageur {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  idNumber: string;
  idType?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

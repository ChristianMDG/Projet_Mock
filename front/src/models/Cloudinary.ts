import { Base } from '@/models/Base';
import { UserOperator } from '@/models/UserOperator';
import { Gare } from './Gare';

export interface Cloudinary extends Base {
  publicId: string;
  url: string;
  format?: string;
  resourceType?: string;
  bytes?: number;
  width?: number;
  height?: number;
  userinfo?: UserOperator;
  gares?: Gare[];
}

// Define UserInfo separately.

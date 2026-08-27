import { Base } from '@/models/Base';
import { UserOperator } from '@/models/UserOperator';

export interface Cloudinary extends Base {
  publicId: string;
  url: string;
  format?: string;
  resourceType?: string;
  bytes?: number;
  width?: number;
  height?: number;
  userinfo?: UserOperator;
}

// Define UserInfo separately.

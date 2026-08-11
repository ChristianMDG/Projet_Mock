import { Base } from './Base';
import { Authority } from './Authority';

export interface UserAccount extends Base {
  username: string;
  password?: string;
  isAdmin?: boolean;
  authorities?: Authority[];
}

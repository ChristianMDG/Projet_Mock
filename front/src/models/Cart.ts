import { Base } from '@/models/Base';
import { UserAccount } from '@/models/UserAccount';

export interface Cart extends Base {
  userAccount: UserAccount;
}

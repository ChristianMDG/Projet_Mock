import { Base } from './Base';
import { UserAccount } from './UserAccount';

export interface Wish extends Base {
  userAccount: UserAccount;
}

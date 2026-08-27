import { UserInfo } from './UserInfo';
import { Koperative } from './Koperative';

export interface UserOperator extends UserInfo {
  assignedKoperatives?: Koperative[];
}

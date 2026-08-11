import { UserInfo } from './UserInfo';
import { Guichet } from './Guichet';
import { Koperative } from './Koperative';
import { Gare } from './Gare';

export interface UserOperator extends UserInfo {
  koperative?: Koperative;
  guichets?: Guichet[];
  withKoperative?: boolean;
  departureGare?: Gare;
  assignedKoperatives?: Koperative[];
}

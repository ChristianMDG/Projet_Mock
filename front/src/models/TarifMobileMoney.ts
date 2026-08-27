import { Base } from './Base';

export interface TarifMobileMoney extends Base {
  minAmount: number;
  maxAmount: number;
  fraisRetrait: number;
  fraisTransfert: number;
  operatorName: string;
}

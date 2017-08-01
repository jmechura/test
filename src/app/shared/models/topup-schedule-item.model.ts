import { CurrencyModel } from './currency.model';

export interface TopupScheduleItemModel {
  amount: number;
  currency: CurrencyModel;
  filename: string;
  id: number;
  login: string;
}

import { CurrencyModel } from './currency.model';

export interface PaymentTopupsModel {
  accountNumber: string;
  amount: number;
  cardGroupCode: string;
  changed: string;
  created: string;
  currency: CurrencyModel;
  issuerCode: string;
  settlemntDate: string;
  specificSymbol: string;
  state: string;
  uuid: string;
  variableSymbol: string;
}

export interface PaymentTopupsPredicateObject {
  cardGroupCode?: string;
  createdFrom?: string;
  createdTo?: string;
  issuerCode?: string;
  specificSymbol?: string;
  state?: string;
  variableSymbol?: string;
}

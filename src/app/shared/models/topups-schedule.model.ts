import { CurrencyModel } from './currency.model';

export interface TopupsScheduleModel {
  amountAll: number;
  cardGroupId: string;
  filename: string;
  issuerCode: string;
  specificSymbol: string;
  state: string;
  variableSymbol: string;
  cardGroupName: string;
  currency: CurrencyModel;
}

export interface TopupsSchedulePredicateObject {
  amountAll?: number;
  cardGroupId?: string;
  filename?: string;
  issuerCode?: string;
  specificSymbol?: string;
  state?: string;
  variableSymbol?: string;
  cardGroupName?: string;
}

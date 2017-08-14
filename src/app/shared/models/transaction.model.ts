import { CurrencyModel } from './currency.model';

export interface Transaction {
  amount: number;
  approvalCode: string;
  cardGroupCode: string;
  cardGroupName: string;
  cardType: string;
  cln: string;
  currency: CurrencyModel;
  dstStan: number;
  issuerCode: string;
  merchantCode: string;
  networkCode: string;
  orgUnitCode: string;
  responseCode: string;
  rrn: string;
  specificSymbol: string;
  state: string;
  termCity: string;
  termDttm: string;
  termName: string;
  termStreet: string;
  terminalCode: string;
  transactionType: string;
  uuid: string;
  vs: string;
}

export interface TransactionPredicateObject {
  amount?: number;
  approvalCode?: string;
  cardGroupCode?: string;
  cln?: string;
  dstStan?: number;
  issuerCode?: string;
  merchantCode?: string;
  networkCode?: string;
  orgUnitCode?: string;
  responseCode?: string;
  rrn?: string;
  specificSymbol?: string;
  state?: string;
  termDttmFrom?: string;
  termDttmTo?: string;
  terminalCode?: string;
  transactionType?: string;
  uuid?: string;
  vs?: string;
}

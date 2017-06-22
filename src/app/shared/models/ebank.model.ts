export interface Ebank {
  accountNumber: string;
  amount: number;
  cardGroupCode: string;
  cardGroupPrimaryId: string;
  currencyCode: string;
  issuerCode: string;
  pk: Pk;
  specificSymbol: string;
  state: string;
  variableSymbol: string;
}

export interface Pk {
  termDttm: string;
  uuid: string;
}

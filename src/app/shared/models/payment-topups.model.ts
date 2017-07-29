export interface PaymentTopupsModel {
  accountNumber: string;
  amount: number;
  cardGroupCode: string;
  changed: string;
  created: string;
  currency: {
    code: string;
    digits: number;
    number: number;
  };
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

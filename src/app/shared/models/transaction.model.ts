export interface Transaction {
  amount: number;
  approvalCode: string;
  cardGroupCode: string;
  cln: string;
  dstStan: number;
  issuerCode: string;
  merchantCode: string;
  networkCode: string;
  orgUnitCode: string;
  responseCode: string;
  rrn: string;
  specificSymbol: string;
  state: string;
  termDttm: string;
  terminalCode: string;
  transactionType: string;
  uuid: string;
  vs: string;
}

export interface TransactionSearch {
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

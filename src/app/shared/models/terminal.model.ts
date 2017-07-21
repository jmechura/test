export interface TerminalModel {
  city: string;
  code: string;
  coefficient: number;
  country: string;
  id: string;
  merchantCode: string;
  merchantId: string;
  name: string;
  networkCode: string;
  note: string;
  orgUnitId: string;
  region: string;
  state: string;
  street: string;
  zip: string;
}

export interface TerminalPredicateObject {
  code?: string;
  name?: string;
  networkCode?: string;
  merchantCode?: string;
  orgUnitCode?: string;
}

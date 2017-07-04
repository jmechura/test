export interface TerminalModel {
  city: string;
  code: string;
  coefficient: number;
  country: string;
  id: string;
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

export interface TerminalSearch {
  code: string;
  name: string;
  networkCode: string;
  orgUnitId: number;
}

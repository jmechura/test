export interface OrgUnitModel {
  city: string;
  code: string;
  id?: string;
  merchantId: string;
  name: string;
  networkCode: string;
  note: string;
  region: string;
  state: string;
  street: string;
  zip: string;
}

export interface OrgUnitPredicateObject {
  code: string;
  merchantId: number;
  merchantName: string;
  name: string;
  networkCode: string;
  networkName: string;
  orgUnitName: string;
}

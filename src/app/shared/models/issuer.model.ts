export interface IssuerModel {
  addressName?: string;
  city?: string;
  code?: string;
  contactFirstname?: string;
  contactLastname?: string;
  dic?: string;
  email?: string;
  ico?: string;
  maskedClnUse?: boolean;
  name?: string;
  passwordHashValidityMinute?: number;
  phone?: string;
  state?: 'ENABLED' | 'DISABLED';
  street?: string;
  zip?: string;
}

export interface IssuerPredicateObject {
  code?: string;
  name?: string;
  networkCode?: string;
  networkName?: string;
}


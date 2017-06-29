export interface IssuerModel {
  addressName?: string;
  city?: string;
  code?: string;
  contactFirstname?: string;
  contactLastname?: string;
  dic?: string;
  email?: string;
  ico?: string;
  maskedClnUse?: string;
  name?: string;
  passwordHashValidityMinutes?: number;
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

export function fillIssuer(): IssuerModel {
  return {
    addressName: '',
    city: '',
    code: '',
    contactFirstname: '',
    contactLastname: '',
    dic: '',
    email: '',
    ico: '',
    maskedClnUse: '',
    name: '',
    passwordHashValidityMinutes: 0,
    phone: '',
    state: 'ENABLED',
    street: '',
    zip: '',
  };
}

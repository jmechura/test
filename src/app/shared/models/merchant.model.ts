export interface MerchantModel {
  bankAccount?: string;
  city?: string;
  code?: string;
  country?: string;
  dic?: string;
  email?: string;
  ico?: string;
  id?: string;
  name?: string;
  networkCode?: string;
  note?: string;
  phone?: string;
  region?: string;
  state?: string;
  street?: string;
  zip?: string;
}

export interface MerchantPredicateObject {
  code?: string;
  name?: string;
  networkCode?: string;
  networkName?: string;
}

export function fillMerchant(): MerchantModel {
  return {
    bankAccount: '',
    city: '',
    code: '',
    country: '',
    dic: '',
    email: '',
    ico: '',
    id: '',
    name: '',
    networkCode: 'bancibo',
    note: '',
    phone: '',
    region: '',
    state: 'ENABLED',
    street: '',
    zip: '',
  };
}

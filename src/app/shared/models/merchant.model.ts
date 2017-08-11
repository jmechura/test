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
  name?: string;
  ico?: string;
  dic?: string;
  city?: string;
  zip?: string;
  networkCode?: string;
  merchantCode?: string;
}

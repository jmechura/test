export interface CardGroupModel {
  bankAccount: string;
  city: string;
  code: string;
  contact: string;
  contact2: string;
  createDefaultDeliveryAddress: true;
  createSpecSymbol: true;
  dic: string;
  email: string;
  externalCode: string;
  ico: string;
  id: string;
  issuerCode: string;
  limit: number;
  limitType: string;
  name: string;
  phone: string;
  specificSymbol: string;
  state: string;
  street: string;
  taxType: string;
  taxValue: number;
  zip: string;
  country: string;
}

export interface CardGroupSearchModel {
  code?: string;
  id?: string;
  issuerCode?: string;
  name?: string;
}

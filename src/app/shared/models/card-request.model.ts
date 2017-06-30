import { Moment } from 'moment';

export interface CardRequestModel {
  cardGroup: CardGroupModel;
  cardGroupCode: string;
  cardGroupName: string;
  cardNumber: number;
  created: string | Moment;
  createdBy: string;
  issuerCode: string;
  processedCard: number;
  sendCard: number;
  state: string;
  uuid: string;
}

export interface CardGroupModel {
  bankAccount: string;
  city: string;
  code: string;
  contact: string;
  contact2: string;
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
  zip: string;
}

export interface CardRequestSearchModel {
  cardGroupCode?: string;
  createdFrom?: string;
  createdTo?: string;
  issuerCode?: string;
  state?: string;
}

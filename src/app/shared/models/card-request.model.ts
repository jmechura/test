import { Moment } from 'moment';

export interface CardRequestModel {
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

export interface CardRequestSearchModel {
  cardGroupCode?: string;
  createdFrom?: string;
  createdTo?: string;
  issuerCode?: string;
  state?: string;
}

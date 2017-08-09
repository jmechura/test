import { Moment } from 'moment';

export interface Card {
  cardGroupPrimaryCode: string;
  cardGroupPrimaryId: string;
  cardGroupName: string;
  cardUuid: string;
  cln: string;
  expiration: string | Moment;
  expiryDate: string | Moment;
  firstname: string;
  lastname: string;
  issuerCode: string;
  limit: number;
  limitType: string;
  panSequenceNumber: string;
  processRequest: boolean;
  serviceCode: string;
  state: string;
  track2: string;
  type: string;
  login?: string;
}

export interface CardPredicateObject {
  cardGroupCode: string;
  cln: string;
  issuerCode: string;
  lastname: string;
  state: string;
}

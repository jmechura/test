import { Moment } from 'moment';

export interface Card {
  cardGroupPrimaryCode: string;
  cardGroupPrimaryId: string;
  cln: string;
  expiration: string | Moment;
  expiryDate: string | Moment;
  firstname: string;
  lastname: string;
  issuerCode: string;
  limit: number;
  limitType: string;
  panSequenceNumber: string;
  serviceCode: string;
  state: string;
  track2: string;
  type: string;
}

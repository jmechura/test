import { Moment } from 'moment';

export interface ReportModel {
  cardGroupCode: string;
  created: string;
  createdBy: string;
  id: number;
  issuerCode: string;
  merchantCode: string;
  name: string;
  networkCode: string;
  orgUnitCode: string;
  path: string;
  reportDataName: string;
  resource: string;
  resourceAcquirer: string;
  resourceAcquirerId: string;
  resourceId: string;
}

export interface ReportPredicateObject {
  reportName: string;
  createdFrom: string | Moment;
  createdTo: string | Moment;
  networkCode: string;
  orgUnitCode: string;
  merchantCode: string;
  issuerCode: string;
  cardGroupCode: string;
}

export interface ReportModel {
  name: string;
  runAfterStart: boolean;
  running: boolean;
  type: string;
}

export interface ReportPredicateObject {
  name: string;
  type: string;
}

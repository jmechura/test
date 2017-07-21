export interface AdminReportModel {
  name: string;
  runAfterStart: boolean;
  running: boolean;
  type: string;
}

export interface AdminReportPredicateObject {
  name: string;
  type: string;
}

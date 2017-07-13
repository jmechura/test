export interface ImportModel {
  name: string;
  nameRead: string;
  runAfterStart: boolean;
  running: boolean;
  type: string;
}

export interface ImportPredicateObject {
  name: string;
  type: string;
}

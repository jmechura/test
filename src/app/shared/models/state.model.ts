export interface StateModel<T> {
  data?: T;
  error: Response | null;
  loading: boolean;
}

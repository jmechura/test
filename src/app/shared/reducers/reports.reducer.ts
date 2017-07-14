import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Pagination } from '../models/pagination.model';
import { ReportModel } from '../models/report.model';

export const reportActions = {
  REPORTS_GET_REQUEST: 'REPORTS_GET_REQUEST',
  REPORTS_GET_FAIL: 'REPORTS_GET_FAIL',
  REPORTS_GET: 'REPORTS_GET',
};

export type ReportsState = StateModel<Pagination<ReportModel>>;

const INITIAL_STATE: ReportsState = {error: null, loading: false};

export function reportsReducer(state: ReportsState = INITIAL_STATE, action: Action): ReportsState {
  switch (action.type) {
    case reportActions.REPORTS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case reportActions.REPORTS_GET_FAIL:
      return {error: action.payload, loading: false};

    case reportActions.REPORTS_GET:
      return {data: action.payload, error: null, loading: false};

    default:
      return state;
  }
}

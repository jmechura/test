import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Pagination } from '../models/pagination.model';
import { ReportModel } from '../models/report.model';

export const reportsActions = {
  REPORTS_GET_REQUEST: 'REPORTS_GET_REQUEST',
  REPORTS_GET_FAIL: 'REPORTS_GET_FAIL',
  REPORTS_GET: 'REPORTS_GET',
};

export type ReportState = StateModel<Pagination<ReportModel>>;

const INITIAL_STATE: ReportState = {error: null, loading: false};

export function reportsReducer(state: ReportState = INITIAL_STATE, action: Action): ReportState {
  switch (action.type) {
    case reportsActions.REPORTS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case reportsActions.REPORTS_GET_FAIL:
      return {error: action.payload, loading: false};

    case reportsActions.REPORTS_GET:
      return {data: action.payload, error: null, loading: false};

    default:
      return state;
  }
}

import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Pagination } from '../models/pagination.model';
import { AdminReportModel } from '../models/admin-report.model';

export const adminReportActions = {
  ADMIN_REPORTS_GET_REQUEST: 'ADMIN_REPORTS_GET_REQUEST',
  ADMIN_REPORTS_GET_FAIL: 'ADMIN_REPORTS_GET_FAIL',
  ADMIN_REPORTS_GET: 'ADMIN_REPORTS_GET',
};

export type AdminReportState = StateModel<Pagination<AdminReportModel>>;

const INITIAL_STATE: AdminReportState = {error: null, loading: false};

export function adminReportsReducer(state: AdminReportState = INITIAL_STATE, action: Action): AdminReportState {
  switch (action.type) {
    case adminReportActions.ADMIN_REPORTS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case adminReportActions.ADMIN_REPORTS_GET_FAIL:
      return {error: action.payload, loading: false};

    case adminReportActions.ADMIN_REPORTS_GET:
      return {data: action.payload, error: null, loading: false};

    default:
      return state;
  }
}

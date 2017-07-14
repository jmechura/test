import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { ReportModel } from '../models/report.model';

export const reportDetailActions = {
  REPORTS_DETAIL_GET_REQUEST: 'REPORTS_DETAIL_GET_REQUEST',
  REPORTS_DETAIL_GET_FAIL: 'REPORTS_DETAIL_GET_FAIL',
  REPORTS_DETAIL_GET: 'REPORTS_DETAIL_GET',
  REPORT_DETAIL_PUT_REQUEST: 'REPORT_DETAIL_PUT_REQUEST',
  REPORT_DETAIL_PUT: 'REPORT_DETAIL_PUT',
  REPORT_DETAIL_PUT_FAIL: 'REPORT_DETAIL_PUT_FAIL'
};


const INITIAL_STATE: StateModel<ReportModel> = {error: null, loading: false};

export function reportDetailReducer(state: StateModel<ReportModel> = INITIAL_STATE, action: Action): StateModel<ReportModel> {
  switch (action.type) {
    case reportDetailActions.REPORTS_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case reportDetailActions.REPORTS_DETAIL_GET_FAIL:
      return {error: action.payload, loading: false};

    case reportDetailActions.REPORTS_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case reportDetailActions.REPORT_DETAIL_PUT_REQUEST:
      return {data: state.data, error: null, loading: true};

    case reportDetailActions.REPORT_DETAIL_PUT:
      return {data: action.payload, error: null, loading: false};

    case reportDetailActions.REPORT_DETAIL_PUT_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

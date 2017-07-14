import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const reportTypeActions = {
  REPORT_TYPE_GET_REQUEST: 'REPORT_TYPE_GET_REQUEST',
  REPORT_TYPE_GET_FAIL: 'REPORT_TYPE_GET_FAIL',
  REPORT_TYPE_GET: 'REPORT_TYPE_GET',
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function reportTypeReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case reportTypeActions.REPORT_TYPE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case reportTypeActions.REPORT_TYPE_GET_FAIL:
      return {error: action.payload, loading: false};

    case reportTypeActions.REPORT_TYPE_GET:
      return {data: action.payload, error: null, loading: false};

    default:
      return state;
  }
}

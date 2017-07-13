import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const importTypeActions = {
  IMPORT_TYPE_GET_REQUEST: 'IMPORT_TYPE_GET_REQUEST',
  IMPORT_TYPE_GET: 'IMPORT_TYPE_GET',
  IMPORT_TYPE_GET_FAIL: 'IMPORT_TYPE_GET_FAIL'
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function importTypeReducer(state: StateModel<string[]> = INITIAL_STATE,
                                  action: Action): StateModel<string[]> {
  switch (action.type) {
    case importTypeActions.IMPORT_TYPE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case importTypeActions.IMPORT_TYPE_GET:
      return {data: action.payload, error: null, loading: false};

    case importTypeActions.IMPORT_TYPE_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

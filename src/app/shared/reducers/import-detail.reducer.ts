import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { ImportModel } from '../models/import.model';

export const importDetailActions = {
  IMPORT_DETAIL_GET_REQUEST: 'IMPORT_DETAIL_GET_REQUEST',
  IMPORT_DETAIL_GET: 'IMPORT_DETAIL_GET',
  IMPORT_DETAIL_GET_FAIL: 'IMPORT_DETAIL_GET_FAIL',
  IMPORT_DETAIL_PUT_REQUEST: 'IMPORT_DETAIL_PUT_REQUEST',
  IMPORT_DETAIL_PUT: 'IMPORT_DETAIL_PUT',
  IMPORT_DETAIL_PUT_FAIL: 'IMPORT_DETAIL_PUT_FAIL'
};


const INITIAL_STATE: StateModel<ImportModel> = {error: null, loading: false};

export function importDetailReducer(state: StateModel<ImportModel> = INITIAL_STATE,
                                    action: Action): StateModel<ImportModel> {
  switch (action.type) {
    case importDetailActions.IMPORT_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case importDetailActions.IMPORT_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case importDetailActions.IMPORT_DETAIL_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    case importDetailActions.IMPORT_DETAIL_PUT_REQUEST:
      return {data: state.data, error: null, loading: true};

    case importDetailActions.IMPORT_DETAIL_PUT:
      return {data: action.payload, error: null, loading: false};

    case importDetailActions.IMPORT_DETAIL_PUT_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

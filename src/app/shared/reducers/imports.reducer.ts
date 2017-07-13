import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Pagination } from '../models/pagination.model';
import { ImportModel } from '../models/import.model';

export const importActions = {
  IMPORTS_GET_REQUEST: 'IMPORTS_GET_REQUEST',
  IMPORTS_GET: 'IMPORTS_GET',
  IMPORTS_GET_FAIL: 'IMPORTS_GET_FAIL'
};

export type ImportState = StateModel<Pagination<ImportModel>>;

const INITIAL_STATE: ImportState = {error: null, loading: false};

export function importsReducer(state: ImportState = INITIAL_STATE,
                               action: Action): ImportState {
  switch (action.type) {
    case importActions.IMPORTS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case importActions.IMPORTS_GET:
      return {data: action.payload, error: null, loading: false};

    case importActions.IMPORTS_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

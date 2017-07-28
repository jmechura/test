import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { CodeModel } from '../models/code.model';

export const importCodeActions = {
  IMPORT_CODE_GET_REQUEST: 'IMPORT_CODE_GET_REQUEST',
  IMPORT_CODE_GET: 'IMPORT_CODE_GET',
  IMPORT_CODE_GET_FAIL: 'IMPORT_CODE_GET_FAIL'
};

const INITIAL_STATE: StateModel<CodeModel[]> = {error: null, loading: false};

export function importCodeReducer(state: StateModel<CodeModel[]> = INITIAL_STATE,
                                  action: Action): StateModel<CodeModel[]> {
  switch (action.type) {
    case importCodeActions.IMPORT_CODE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case importCodeActions.IMPORT_CODE_GET:
      return {data: action.payload, error: null, loading: false};

    case importCodeActions.IMPORT_CODE_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

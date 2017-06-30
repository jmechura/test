import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { CodeModel } from '../models/code.model';

export const issuerCodeActions = {
  ISSUER_CODE_GET_REQUEST: 'ISSUER_CODE_GET_REQUEST',
  ISSUER_CODE_GET: 'ISSUER_CODE_GET',
  ISSUER_CODE_GET_FAIL: 'ISSUER_CODE_GET_FAIL'
};

const INITIAL_STATE: StateModel<CodeModel[]> = {error: null, loading: false};

export function issuerCodeReducer(state: StateModel<CodeModel[]> = INITIAL_STATE,
                                  action: Action): StateModel<CodeModel[]> {
  switch (action.type) {
    case issuerCodeActions.ISSUER_CODE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case issuerCodeActions.ISSUER_CODE_GET:
      return {data: action.payload, error: null, loading: false};

    case issuerCodeActions.ISSUER_CODE_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

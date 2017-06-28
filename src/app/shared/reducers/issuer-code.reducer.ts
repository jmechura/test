import { StateModel } from '../models/state.model';
import { IssuerCodeModel } from '../models/issuer-code.model';
import { Action } from '@ngrx/store';
export const issuerCodeActions = {
  ISSUER_CODE_GET_REQUEST: 'ISSUER_CODE_GET_REQUEST',
  ISSUER_CODE_GET: 'ISSUER_CODE_GET',
  ISSUER_CODE_GET_FAIL: 'ISSUER_CODE_GET_FAIL'
};

const INITIAL_STATE: StateModel<IssuerCodeModel[]> = {error: null, loading: false};

export function issuerCodeReducer(state: StateModel<IssuerCodeModel[]> = INITIAL_STATE,
                                  action: Action): StateModel<IssuerCodeModel[]> {
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

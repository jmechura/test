import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { CodeModel } from '../models/code.model';

export const networkCodeActions = {
  NETWORK_CODE_GET_REQUEST: 'NETWORK_CODE_GET_REQUEST',
  NETWORK_CODE_GET: 'NETWORK_CODE_GET',
  NETWORK_CODE_GET_FAIL: 'NETWORK_CODE_GET_FAIL'
};

export type NetworkCodeState = StateModel<CodeModel[]>;

const INITIAL_STATE: NetworkCodeState = {error: null, loading: false};

export function networkCodeReducer(state: NetworkCodeState = INITIAL_STATE, action: Action): NetworkCodeState {
  switch (action.type) {
    case networkCodeActions.NETWORK_CODE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case networkCodeActions.NETWORK_CODE_GET:
      return {data: action.payload, error: null, loading: false};

    case networkCodeActions.NETWORK_CODE_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { NetworkCodeModel } from '../models/network-code.model';

export const networkCodeActions = {
  NETWORK_CODE_GET_REQUEST: 'NETWORK_CODE_GET_REQUEST',
  NETWORK_CODE_GET: 'NETWORK_CODE_GET',
  NETWORK_CODE_GET_FAIL: 'NETWORK_CODE_GET_FAIL'
};

const INITIAL_STATE: StateModel<NetworkCodeModel[]> = {error: null, loading: false};

export function networkCodeReducer(state: StateModel<NetworkCodeModel[]> = INITIAL_STATE,
                                   action: Action): StateModel<NetworkCodeModel[]> {
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

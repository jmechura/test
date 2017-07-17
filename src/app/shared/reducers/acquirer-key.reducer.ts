import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { AcquirerKey } from '../models/acquirer-key.model';

export const acquirerKeysActions = {
  ACQUIRER_KEYS_GET_REQUEST: 'ACQUIRER_KEYS_GET_REQUEST',
  ACQUIRER_KEYS_GET: 'ACQUIRER_KEYS_GET',
  ACQUIRER_KEYS_GET_FAIL: 'ACQUIRER_KEYS_GET_FAIL',
  ACQUIRER_KEYS_POST_REQUEST: 'ACQUIRER_KEYS_POST_REQUEST',
  ACQUIRER_KEYS_POST: 'ACQUIRER_KEYS_POST',
  ACQUIRER_KEYS_POST_FAIL: 'ACQUIRER_KEYS_POST_FAIL',
  ACQUIRER_KEYS_SET_LAST_POST_REQUEST: 'ACQUIRER_KEYS_SET_LAST_POST_REQUEST',
  ACQUIRER_KEYS_SET_LAST_POST: 'ACQUIRER_KEYS_SET_LAST_POST',
  ACQUIRER_KEYS_SET_LAST_POST_FAIL: 'ACQUIRER_KEYS_SET_LAST_POST_FAIL',
};

const INITIAL_STATE: StateModel<AcquirerKey[]> = {error: null, loading: false};

export function acquirerKeysReducer(state: StateModel<AcquirerKey[]> = INITIAL_STATE,
                                    action: Action): StateModel<AcquirerKey[]> {
  switch (action.type) {
    case acquirerKeysActions.ACQUIRER_KEYS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case acquirerKeysActions.ACQUIRER_KEYS_GET:
      return {data: action.payload, error: null, loading: false};

    case acquirerKeysActions.ACQUIRER_KEYS_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    case acquirerKeysActions.ACQUIRER_KEYS_POST_REQUEST:
      return {data: state.data, error: null, loading: true};

    case acquirerKeysActions.ACQUIRER_KEYS_POST:
      return {data: [...state.data, action.payload], error: null, loading: false};

    case acquirerKeysActions.ACQUIRER_KEYS_POST_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    case acquirerKeysActions.ACQUIRER_KEYS_SET_LAST_POST_REQUEST:
      return {data: state.data, error: null, loading: true};

    case acquirerKeysActions.ACQUIRER_KEYS_SET_LAST_POST:
      return {
        data: state.data.map(item => {
          if (item.id === action.payload.id) {
            return action.payload;
          } else {
            return item;
          }
        }),
        error: null,
        loading: false
      };

    case acquirerKeysActions.ACQUIRER_KEYS_SET_LAST_POST_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

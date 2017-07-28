import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const addressTypeActions = {
  ADDRESS_TYPE_GET_REQUEST: 'ADDRESS_TYPE_GET_REQUEST',
  ADDRESS_TYPE_GET: 'ADDRESS_TYPE_GET',
  ADDRESS_TYPE_GET_FAIL: 'ADDRESS_TYPE_GET_FAIL',
};

const INITIAL_STATE: StateModel<string> = {error: null, loading: false};

export function addressTypeReducer(state: StateModel<string> = INITIAL_STATE,
                                   action: Action): StateModel<string> {
  switch (action.type) {
    case addressTypeActions.ADDRESS_TYPE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case addressTypeActions.ADDRESS_TYPE_GET:
      return {data: action.payload, error: null, loading: false};

    case addressTypeActions.ADDRESS_TYPE_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

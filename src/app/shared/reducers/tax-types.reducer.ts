import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const taxTypeActions = {
  TAX_TYPES_GET_REQUEST: 'TAX_TYPES_GET_REQUEST',
  TAX_TYPES_GET: 'TAX_TYPES_GET',
  TAX_TYPES_GET_FAIL: 'TAX_TYPES_GET_FAIL'
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function taxTypesReducer(state: StateModel<string[]> = INITIAL_STATE,
                                action: Action): StateModel<string[]> {
  switch (action.type) {
    case taxTypeActions.TAX_TYPES_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case taxTypeActions.TAX_TYPES_GET:
      return {data: action.payload, error: null, loading: false};

    case taxTypeActions.TAX_TYPES_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

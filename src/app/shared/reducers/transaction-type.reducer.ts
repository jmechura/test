import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const transactionTypesActions = {
  TRANSACTION_TYPES_GET_REQUEST: 'TRANSACTION_TYPES_GET_REQUEST',
  TRANSACTION_TYPES_GET_FAIL: 'TRANSACTION_TYPES_GET_FAIL',
  TRANSACTION_TYPES_GET: 'TRANSACTION_TYPES_GET'
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function transactionTypeReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case transactionTypesActions.TRANSACTION_TYPES_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case transactionTypesActions.TRANSACTION_TYPES_GET:
      return {data: action.payload, error: null, loading: false};

    case transactionTypesActions.TRANSACTION_TYPES_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

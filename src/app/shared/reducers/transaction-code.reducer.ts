import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const transactionCodesActions = {
  TRANSACTION_CODES_GET_REQUEST: 'TRANSACTION_CODES_GET_REQUEST',
  TRANSACTION_CODES_GET_FAIL: 'TRANSACTION_CODES_GET_FAIL',
  TRANSACTION_CODES_GET: 'TRANSACTION_CODES_GET'
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function transactionCodeReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case transactionCodesActions.TRANSACTION_CODES_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case transactionCodesActions.TRANSACTION_CODES_GET:
      return {data: action.payload, error: null, loading: false};

    case transactionCodesActions.TRANSACTION_CODES_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

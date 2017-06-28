import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const transactionStatesActions = {
  TRANSACTION_STATES_GET_REQUEST: 'TRANSACTION_STATES_GET_REQUEST',
  TRANSACTION_STATES_GET_FAIL: 'TRANSACTION_STATES_GET_FAIL',
  TRANSACTION_STATES_GET: 'TRANSACTION_STATES_GET'
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function transactionStateReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case transactionStatesActions.TRANSACTION_STATES_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case transactionStatesActions.TRANSACTION_STATES_GET:
      return {data: action.payload, error: null, loading: false};

    case transactionStatesActions.TRANSACTION_STATES_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

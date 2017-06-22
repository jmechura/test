import { StateModel } from '../models/state.model';
import { Transaction } from '../models/transaction.model';
import { Action } from '@ngrx/store';

export const transactionActions = {
  TRANSACTION_GET: 'TRANSACTION_GET',
  TRANSACTION_SUCCESS: 'TRANSACTION_SUCCESS',
  TRANSACTION_FAIL: 'TRANSACTION_FAIL'
};

const INITIAL_STATE: StateModel<Transaction> = {error: null, loading: false};

export function transactionReducer(state: StateModel<Transaction> = INITIAL_STATE, action: Action): StateModel<Transaction> {
  // TODO: add pagination
  switch (action.type) {
    case transactionActions.TRANSACTION_GET:
      return {data: state.data, error: null, loading: true};

    case transactionActions.TRANSACTION_SUCCESS:
      return {data: action.payload, error: null, loading: false};

    case transactionActions.TRANSACTION_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

import { StateModel } from '../models/state.model';
import { Transaction } from '../models/transaction.model';
import { Action } from '@ngrx/store';

export const singleTransactionActions = {
  TRANSACTION_GET_REQUEST: 'TRANSACTION_GET_REQUEST',
  TRANSACTION_GET: 'TRANSACTION_GET',
  TRANSACTION_GET_FAIL: 'TRANSACTION_GET_FAIL'
};

const INITIAL_STATE: StateModel<Transaction> = {error: null, loading: false};

export function singleTransactionReducer(state: StateModel<Transaction> = INITIAL_STATE,
                                         action: Action): StateModel<Transaction> {
  switch (action.type) {
    case singleTransactionActions.TRANSACTION_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case singleTransactionActions.TRANSACTION_GET:
      return {data: action.payload, error: null, loading: false};

    case singleTransactionActions.TRANSACTION_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

import { StateModel } from '../models/state.model';
import { Transaction } from '../models/transaction.model';
import { Action } from '@ngrx/store';
import { Pagination } from '../models/pagination.model';

export const transactionActions = {
  TRANSACTIONS_GET_REQUEST: 'TRANSACTIONS_GET_REQUEST',
  TRANSACTIONS_GET: 'TRANSACTIONS_GET',
  TRANSACTIONS_GET_FAIL: 'TRANSACTIONS_GET_FAIL'
};

const INITIAL_STATE: StateModel<Pagination<Transaction>> = {error: null, loading: false};

export function transactionsReducer(state: StateModel<Pagination<Transaction>> = INITIAL_STATE,
                                    action: Action): StateModel<Pagination<Transaction>> {
  // TODO: add pagination
  switch (action.type) {
    case transactionActions.TRANSACTIONS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case transactionActions.TRANSACTIONS_GET:
      return {data: action.payload, error: null, loading: false};

    case transactionActions.TRANSACTIONS_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

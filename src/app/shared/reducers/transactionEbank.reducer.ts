import { StateModel } from '../models/state.model';
import { Ebank } from '../models/ebank.model';
import { Action } from '@ngrx/store';

export const transactionEbankActions = {
  TRANSACTION_EBANK_GET: 'TRANSACTION_EBANK_GET',
  TRANSACTION_EBANK_SUCCESS: 'TRANSACTION_EBANK_SUCCESS',
  TRANSACTION_EBANK_FAIL: 'TRANSACTION_EBANK_FAIL'
};

const INITIAL_STATE: StateModel<Ebank> = {error: null, loading: false};

export function transactionEbankReducer(state: StateModel<Ebank> = INITIAL_STATE, action: Action): StateModel<Ebank> {
  switch (action.type) {
    case transactionEbankActions.TRANSACTION_EBANK_GET:
      return {data: state.data, error: null, loading: true};

    case transactionEbankActions.TRANSACTION_EBANK_SUCCESS:
      return {data: action.payload, error: null, loading: false};

    case transactionEbankActions.TRANSACTION_EBANK_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

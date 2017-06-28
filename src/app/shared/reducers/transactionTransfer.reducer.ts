import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Transfer } from '../models/transfer.model';

export const transactionTransferActions = {
  TRANSACTION_TRANSFERS_GET_REQUEST: 'TRANSACTION_TRANSFERS_GET_REQUEST',
  TRANSACTION_TRANSFERS_GET_FAIL: 'TRANSACTION_TRANSFERS_GET_FAIL',
  TRANSACTION_TRANSFERS_GET: 'TRANSACTION_TRANSFERS_GET'
};

const INITIAL_STATE: StateModel<Transfer[]> = {error: null, loading: false};

export function transactionTransferReducer(state: StateModel<Transfer[]> = INITIAL_STATE, action: Action): StateModel<Transfer[]> {
  switch (action.type) {
    case transactionTransferActions.TRANSACTION_TRANSFERS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case transactionTransferActions.TRANSACTION_TRANSFERS_GET:
      return {data: action.payload, error: null, loading: false};

    case transactionTransferActions.TRANSACTION_TRANSFERS_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

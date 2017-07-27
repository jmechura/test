import { StateModel } from '../models/state.model';
import { Pagination } from '../models/pagination.model';
import { Action } from '@ngrx/store';
import { Transfer } from '../models/transfer.model';

export const transfersActions = {
  TRANSFERS_GET_REQUEST: 'TRANSFERS_GET_REQUEST',
  TRANSFERS_GET: 'TRANSFERS_GET',
  TRANSFERS_GET_FAIL: 'TRANSFERS_GET_FAIL',
};

const INITIAL_STATE: StateModel<Pagination<Transfer>> = {error: null, loading: false};

export function transfersReducer(state: StateModel<Pagination<Transfer>> = INITIAL_STATE,
                                 action: Action): StateModel<Pagination<Transfer>> {
  switch (action.type) {
    case transfersActions.TRANSFERS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case transfersActions.TRANSFERS_GET:
      return {data: action.payload, error: null, loading: false};

    case transfersActions.TRANSFERS_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { PaymentTopupsModel } from '../models/payment-topups.model';
import { Pagination } from '../models/pagination.model';

export const paymentTopupsActions = {
  TOPUPS_GET_REQUEST: 'TOPUPS_GET_REQUEST',
  TOPUPS_GET: 'TOPUPS_GET',
  TOPUPS_GET_FAIL: 'TOPUPS_GET_FAIL',
};

export type PaymentTopupsState = StateModel<Pagination<PaymentTopupsModel>>;

const INITIAL_STATE: StateModel<Pagination<PaymentTopupsModel>> = {error: null, loading: false};

export function paymentTopupsReducer(state: PaymentTopupsState = INITIAL_STATE, action: Action): PaymentTopupsState {
  switch (action.type) {
    case paymentTopupsActions.TOPUPS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case paymentTopupsActions.TOPUPS_GET:
      return {data: action.payload, error: null, loading: false};

    case paymentTopupsActions.TOPUPS_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

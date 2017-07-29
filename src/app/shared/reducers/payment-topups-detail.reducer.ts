import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { PaymentTopupsModel } from '../models/payment-topups.model';

export const paymentTopupsDetailActions = {
  TOPUPS_DETAIL_GET_REQUEST: 'TOPUPS_DETAIL_GET_REQUEST',
  TOPUPS_DETAIL_GET: 'TOPUPS_DETAIL_GET',
  TOPUPS_DETAIL_GET_FAIL: 'TOPUPS_DETAIL_GET_FAIL',
};

export type PaymentTopupsDetailState = StateModel<PaymentTopupsModel>;

const INITIAL_STATE: StateModel<PaymentTopupsModel> = {error: null, loading: false};

export function paymentTopupsDetailReducer(state: PaymentTopupsDetailState = INITIAL_STATE, action: Action): PaymentTopupsDetailState {
  switch (action.type) {
    case paymentTopupsDetailActions.TOPUPS_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case paymentTopupsDetailActions.TOPUPS_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case paymentTopupsDetailActions.TOPUPS_DETAIL_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

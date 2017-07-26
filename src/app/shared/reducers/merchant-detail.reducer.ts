import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { MerchantModel } from '../models/merchant.model';

export const merchantDetailActions = {
  MERCHANT_DETAIL_GET_REQUEST: 'MERCHANT_DETAIL_GET_REQUEST',
  MERCHANT_DETAIL_GET: 'MERCHANT_DETAIL_GET',
  MERCHANT_DETAIL_GET_FAIL: 'MERCHANT_DETAIL_GET_FAIL',
  MERCHANT_DETAIL_POST_REQUEST: 'MERCHANT_DETAIL_POST_REQUEST',
  MERCHANT_DETAIL_POST: 'MERCHANT_DETAIL_POST',
  MERCHANT_DETAIL_POST_FAIL: 'MERCHANT_DETAIL_POST_FAIL',
};

const INITIAL_STATE: StateModel<MerchantModel> = {error: null, loading: false};

export function merchantsDetailReducer(state: StateModel<MerchantModel> = INITIAL_STATE,
                                       action: Action): StateModel<MerchantModel> {
  switch (action.type) {
    case merchantDetailActions.MERCHANT_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case merchantDetailActions.MERCHANT_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case merchantDetailActions.MERCHANT_DETAIL_GET_FAIL:
      return {error: action.payload, loading: false};

    case merchantDetailActions.MERCHANT_DETAIL_POST_REQUEST:
      return {data: state.data, error: null, loading: true};

    case merchantDetailActions.MERCHANT_DETAIL_POST:
      return {data: action.payload, error: null, loading: false};

    case merchantDetailActions.MERCHANT_DETAIL_POST_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

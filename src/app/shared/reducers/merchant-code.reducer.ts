import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { MerchantCodeModel } from '../models/merchant-code.model';

export const merchantCodeActions = {
  MERCHANT_CODE_GET_REQUEST: 'MERCHANT_CODE_GET_REQUEST',
  MERCHANT_CODE_GET: 'MERCHANT_CODE_GET',
  MERCHANT_CODE_GET_FAIL: 'MERCHANT_CODE_GET_FAIL'
};

const INITIAL_STATE: StateModel<MerchantCodeModel[]> = {error: null, loading: false};

export function merchantCodeReducer(state: StateModel<MerchantCodeModel[]> = INITIAL_STATE,
                                    action: Action): StateModel<MerchantCodeModel[]> {
  switch (action.type) {
    case merchantCodeActions.MERCHANT_CODE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case merchantCodeActions.MERCHANT_CODE_GET:
      return {data: action.payload, error: null, loading: false};

    case merchantCodeActions.MERCHANT_CODE_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

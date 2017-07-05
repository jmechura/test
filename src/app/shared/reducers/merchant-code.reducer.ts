import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { CodeModel } from '../models/code.model';

export const merchantCodeActions = {
  MERCHANT_CODE_GET_REQUEST: 'MERCHANT_CODE_GET_REQUEST',
  MERCHANT_CODE_GET: 'MERCHANT_CODE_GET',
  MERCHANT_CODE_GET_FAIL: 'MERCHANT_CODE_GET_FAIL'
};

export type MerchantCodeState = StateModel<CodeModel[]>;

const INITIAL_STATE: MerchantCodeState = {error: null, loading: false};

export function merchantCodeReducer(state: MerchantCodeState = INITIAL_STATE, action: Action): MerchantCodeState {
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

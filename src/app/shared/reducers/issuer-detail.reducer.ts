import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { MerchantModel } from '../models/merchant.model';
import { IssuerModel } from '../models/issuer.model';

export const issuerDetailActions = {
  ISSUER_DETAIL_GET_REQUEST: 'ISSUER_DETAIL_GET_REQUEST',
  ISSUER_DETAIL_GET: 'ISSUER_DETAIL_GET',
  ISSUER_DETAIL_GET_FAIL: 'ISSUER_DETAIL_GET_FAIL',
  ISSUER_DETAIL_PUT_REQUEST: 'ISSUER_DETAIL_PUT_REQUEST',
  ISSUER_DETAIL_PUT: 'ISSUER_DETAIL_PUT',
  ISSUER_DETAIL_PUT_FAIL: 'ISSUER_DETAIL_PUT_FAIL',
};

const INITIAL_STATE: StateModel<IssuerModel> = {error: null, loading: false};

export function issuerDetailReducer(state: StateModel<MerchantModel> = INITIAL_STATE,
                                    action: Action): StateModel<MerchantModel> {
  switch (action.type) {
    case issuerDetailActions.ISSUER_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case issuerDetailActions.ISSUER_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case issuerDetailActions.ISSUER_DETAIL_GET_FAIL:
      return {error: action.payload, loading: false};

    case issuerDetailActions.ISSUER_DETAIL_PUT_REQUEST:
      return {data: state.data, error: null, loading: true};

    case issuerDetailActions.ISSUER_DETAIL_PUT:
      return {data: action.payload, error: null, loading: false};

    case issuerDetailActions.ISSUER_DETAIL_PUT_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

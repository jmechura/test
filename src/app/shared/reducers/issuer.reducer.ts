import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { MerchantModel } from '../models/merchant.model';
import { Pagination } from '../models/pagination.model';
import { IssuerModel } from '../models/issuer.model';

export const issuersActions = {
  ISSUERS_API_GET: 'ISSUERS_API_GET',
  ISSUERS_GET: 'ISSUERS_GET',
  ISSUERS_GET_FAIL: 'ISSUERS_GET_FAIL',
};

const INITIAL_STATE: StateModel<Pagination<IssuerModel>> = {error: null, loading: false};

export function issuersReducer(state: StateModel<Pagination<MerchantModel>> = INITIAL_STATE,
                               action: Action): StateModel<Pagination<MerchantModel>> {
  switch (action.type) {
    case issuersActions.ISSUERS_API_GET:
      return {data: state.data, error: null, loading: true};

    case issuersActions.ISSUERS_GET:
      return {data: action.payload, error: null, loading: false};

    case issuersActions.ISSUERS_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

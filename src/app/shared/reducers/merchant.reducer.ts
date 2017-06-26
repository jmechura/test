import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { MerchantModel } from '../models/merchant.model';
import { Pagination } from '../models/pagination.model';

export const merchantsActions = {
  MERCHANTS_API_GET: 'MERCHANTS_API_GET',
  MERCHANTS_GET: 'MERCHANTS_GET',
  MERCHANTS_GET_FAIL: 'MERCHANTS_GET_FAIL',
};

const INITIAL_STATE: StateModel<Pagination<MerchantModel>> = {error: null, loading: false};

export function merchantsReducer(state: StateModel<Pagination<MerchantModel>> = INITIAL_STATE,
                                 action: Action): StateModel<Pagination<MerchantModel>> {
  switch (action.type) {
    case merchantsActions.MERCHANTS_API_GET:
      return {data: state.data, error: null, loading: true};

    case merchantsActions.MERCHANTS_GET:
      return {data: action.payload, error: null, loading: false};

    case merchantsActions.MERCHANTS_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

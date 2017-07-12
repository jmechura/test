import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { MerchantModel } from '../models/merchant.model';
import { Pagination } from '../models/pagination.model';
import { IssuerModel } from '../models/issuer.model';

export const templatesActions = {
  TEMPLATES_GET_REQUEST: 'TEMPLATES_GET_REQUEST',
  TEMPLATES_GET: 'TEMPLATES_GET',
  TEMPLATES_GET_FAIL: 'TEMPLATES_GET_FAIL',
};

const INITIAL_STATE: StateModel<Pagination<IssuerModel>> = {error: null, loading: false};

export function templatesReducer(state: StateModel<Pagination<MerchantModel>> = INITIAL_STATE,
                                 action: Action): StateModel<Pagination<MerchantModel>> {
  switch (action.type) {
    case templatesActions.TEMPLATES_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case templatesActions.TEMPLATES_GET:
      return {data: action.payload, error: null, loading: false};

    case templatesActions.TEMPLATES_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

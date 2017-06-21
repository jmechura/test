import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { AccountModel } from '../models/account.model';

export const accountActions = {
  ACCOUNT_GET: 'ACCOUNT_GET',
  ACCOUNT_API_GET: 'ACCOUNT_API_GET',
  ACCOUNT_API_GET_FAIL: 'ACCOUNT_API_GET_FAIL',
  ACCOUNT_API_PUT: 'ACCOUNT_API_PUT',
  ACCOUNT_PUT: 'ACCOUNT_PUT',
  ACCOUNT_API_PUT_FAIL: 'ACCOUNT_API_PUT_FAIL',
};

const INITIAL_STATE: StateModel<AccountModel> = {error: null, loading: false};

export function accountReducer(state: StateModel<AccountModel> = INITIAL_STATE, action: Action): StateModel<AccountModel> {
  switch (action.type) {
    case accountActions.ACCOUNT_API_GET:
      return {data: state.data, error: null, loading: true};

    case accountActions.ACCOUNT_GET:
      return {data: action.payload, error: null, loading: false};

    case accountActions.ACCOUNT_API_GET_FAIL:
      return {error: action.payload, loading: false};

    case accountActions.ACCOUNT_API_PUT:
      return {data: state.data, error: null, loading: true};

    case accountActions.ACCOUNT_PUT:
      return {data: action.payload, error: null, loading: false};

    case accountActions.ACCOUNT_API_PUT_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

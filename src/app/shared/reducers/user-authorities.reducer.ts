import { Action } from '@ngrx/store';
import { StateModel } from '../models/state.model';

export const userAuthorityActions = {
  USER_AUTHORITY_GET_REQUEST: 'USER_AUTHORITY_GET_REQUEST',
  USER_AUTHORITY_GET: 'USER_AUTHORITY_GET',
  USER_AUTHORITY_GET_FAIL: 'USER_AUTHORITY_GET_FAIL',
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function userAuthorityReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case userAuthorityActions.USER_AUTHORITY_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case userAuthorityActions.USER_AUTHORITY_GET:
      return {data: action.payload, error: null, loading: false};

    case userAuthorityActions.USER_AUTHORITY_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

import { Action } from '@ngrx/store';
import { StateModel } from '../models/state.model';
import { Pagination } from '../models/pagination.model';
import { ProfileModel } from '../models/profile.model';

export const userActions = {
  USER_GET_REQUEST: 'USER_GET_REQUEST',
  USER_GET: 'USER_GET',
  USER_GET_FAIL: 'USER_GET_FAIL',
  USER_PUT_REQUEST: 'USER_PUT_REQUEST',
  USER_PUT: 'USER_PUT',
  USER_PUT_FAIL: 'USER_PUT_FAIL',
};

const INITIAL_STATE: StateModel<Pagination<ProfileModel>> = {error: null, loading: false};

export function userReducer(state: StateModel<Pagination<ProfileModel>> = INITIAL_STATE,
                            action: Action): StateModel<Pagination<ProfileModel>> {
  switch (action.type) {
    case userActions.USER_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case userActions.USER_GET:
      return {data: action.payload, error: null, loading: false};

    case userActions.USER_GET_FAIL:
      return {error: action.payload, loading: false};

    case userActions.USER_PUT_REQUEST:
      return {data: state.data, error: null, loading: true};

    case userActions.USER_PUT:
      return {data: action.payload, error: null, loading: false};

    case userActions.USER_PUT_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

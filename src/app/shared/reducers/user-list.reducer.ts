import { Action } from '@ngrx/store';
import { StateModel } from '../models/state.model';
import { Pagination } from '../models/pagination.model';
import { ProfileModel } from '../models/profile.model';

export const userListActions = {
  USER_LIST_GET_REQUEST: 'USER_LIST_GET_REQUEST',
  USER_LIST_GET: 'USER_LIST_GET',
  USER_LIST_GET_FAIL: 'USER_LIST_GET_FAIL',
};

const INITIAL_STATE: StateModel<Pagination<ProfileModel>> = {error: null, loading: false};

export function userListReducer(state: StateModel<Pagination<ProfileModel>> = INITIAL_STATE,
                                action: Action): StateModel<Pagination<ProfileModel>> {
  switch (action.type) {
    case userListActions.USER_LIST_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case userListActions.USER_LIST_GET:
      return {data: action.payload, error: null, loading: false};

    case userListActions.USER_LIST_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

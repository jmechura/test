import { Action } from '@ngrx/store';
import { StateModel } from '../models/state.model';

export const userResourceActions = {
  USER_RESOURCE_GET_REQUEST: 'USER_RESOURCE_GET_REQUEST',
  USER_RESOURCE_GET: 'USER_RESOURCE_GET',
  USER_RESOURCE_GET_FAIL: 'USER_RESOURCE_GET_FAIL',
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function userResourceReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case userResourceActions.USER_RESOURCE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case userResourceActions.USER_RESOURCE_GET:
      return {data: action.payload, error: null, loading: false};

    case userResourceActions.USER_RESOURCE_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

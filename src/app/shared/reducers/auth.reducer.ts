import { StateModel } from '../models/state.model';
import { AuthModel } from '../models/auth.model';
import { Action } from '@ngrx/store';

export const authActions = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT'
};

const INITIAL_STATE: StateModel<AuthModel> = {error: null, loading: false};

export function authReducer(state: StateModel<AuthModel> = INITIAL_STATE, action: Action): StateModel<AuthModel> {
  switch (action.type) {
    case authActions.LOGIN_REQUEST:
      return {data: state.data, error: null, loading: true};

    case authActions.LOGIN_SUCCESS:
      return {data: action.payload, error: null, loading: false};

    case authActions.LOGIN_FAILURE:
      return {error: action.payload, loading: false};

    case authActions.LOGOUT:
      return INITIAL_STATE;

    default:
      return state;
  }
}

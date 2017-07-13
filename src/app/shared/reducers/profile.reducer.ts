import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { ProfileModel } from '../models/profile.model';

export const profileActions = {
  PROFILE_GET: 'PROFILE_GET',
  PROFILE_GET_REQUEST: 'PROFILE_GET_REQUEST',
  PROFILE_GET_ERROR: 'PROFILE_GET_ERROR',
  PROFILE_PUT: 'PROFILE_PUT',
  PROFILE_PUT_REQUEST: 'PROFILE_PUT_REQUEST',
  PROFILE_PUT_ERROR: 'PROFILE_PUT_ERROR',
  PROFILE_DISCARD: 'PROFILE_DISCARD',
};

export type ProfileState = StateModel<ProfileModel>;

const INITIAL_STATE: ProfileState = {error: null, loading: false};

export function profileReducer(state: ProfileState = INITIAL_STATE, action: Action): ProfileState {
  switch (action.type) {
    case profileActions.PROFILE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case profileActions.PROFILE_GET:
      return {data: action.payload, error: null, loading: false};

    case profileActions.PROFILE_GET_ERROR:
      return {error: action.payload, loading: false};

    case profileActions.PROFILE_PUT_REQUEST:
      return {data: state.data, error: null, loading: true};

    case profileActions.PROFILE_PUT:
      return {data: action.payload, error: null, loading: false};

    case profileActions.PROFILE_PUT_ERROR:
      return {error: action.payload, loading: false};

    case profileActions.PROFILE_DISCARD:
      return INITIAL_STATE;

    default:
      return state;
  }
}

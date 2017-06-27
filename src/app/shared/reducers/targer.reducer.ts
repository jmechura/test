import { Action } from '@ngrx/store';
import { StateModel } from '../models/state.model';

export const targetActions = {
  TARGET_API_GET: 'TARGET_API_GET',
  TARGET_GET: 'TARGET_GET',
  TARGET_GET_FAIL: 'TARGET_GET_FAIL',
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function targetReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case targetActions.TARGET_API_GET:
      return {data: state.data, error: null, loading: true};

    case targetActions.TARGET_GET:
      return {data: action.payload, error: null, loading: false};

    case targetActions.TARGET_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

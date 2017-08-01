import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const paymentTopupsStateActions = {
  TOPUPS_STATE_GET_REQUEST: 'TOPUPS_STATE_GET_REQUEST',
  TOPUPS_STATE_GET: 'TOPUPS_STATE_GET',
  TOPUPS_STATE_GET_FAIL: 'TOPUPS_STATE_GET_FAIL',
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function paymentTopupsStateReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case paymentTopupsStateActions.TOPUPS_STATE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case paymentTopupsStateActions.TOPUPS_STATE_GET:
      return {data: action.payload, error: null, loading: false};

    case paymentTopupsStateActions.TOPUPS_STATE_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

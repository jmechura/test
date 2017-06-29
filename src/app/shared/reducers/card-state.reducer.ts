import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const cardStateActions = {
  CARD_STATE_GET_REQUEST: 'CARD_STATE_GET_REQUEST',
  CARD_STATE_GET: 'CARD_STATE_GET',
  CARD_STATE_GET_FAIL: 'CARD_STATE_GET_FAIL'
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function cardStateReducer(state: StateModel<string[]> = INITIAL_STATE,
                                 action: Action): StateModel<string[]> {
  switch (action.type) {
    case cardStateActions.CARD_STATE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case cardStateActions.CARD_STATE_GET:
      return {data: action.payload, error: null, loading: false};

    case cardStateActions.CARD_STATE_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

import { StateModel } from '../models/state.model';
import { AuthModel } from '../models/auth.model';
import { Action } from '@ngrx/store';

export const cardActions = {
  CARD_API_GET: 'CARD_API_GET',
  CARD_GET: 'CARD_GET',
  CARD_GET_FAIL: 'CARD_GET_FAIL',
};

const INITIAL_STATE: StateModel<AuthModel> = {error: null, loading: false};

export function cardReducer(state: StateModel<AuthModel> = INITIAL_STATE, action: Action): StateModel<AuthModel> {
  switch (action.type) {
    case cardActions.CARD_API_GET:
      return {data: state.data, error: null, loading: true};

    case cardActions.CARD_GET:
      return {data: action.payload, error: null, loading: false};

    case cardActions.CARD_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}


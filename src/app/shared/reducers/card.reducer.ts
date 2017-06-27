import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Pagination } from '../models/pagination.model';
import { Card } from '../models/card.model';

export const cardActions = {
  CARD_API_GET: 'CARD_API_GET',
  CARD_GET: 'CARD_GET',
  CARD_GET_FAIL: 'CARD_GET_FAIL',
};

const INITIAL_STATE: StateModel<Pagination<Card>> = {error: null, loading: false};

export function cardReducer(state: StateModel<Pagination<Card>> = INITIAL_STATE, action: Action): StateModel<Pagination<Card>> {
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


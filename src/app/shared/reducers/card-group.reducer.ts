import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Pagination } from '../models/pagination.model';
import { CardGroupModel } from '../models/card-group.model';

export const cardGroupActions = {
  CARD_GROUPS_GET_REQUEST: 'CARD_GROUPS_GET_REQUEST',
  CARD_GROUPS_GET: 'CARD_GROUPS_GET',
  CARD_GROUPS_GET_FAIL: 'CARD_GROUPS_GET_FAIL',
};

export type CardGroupState = StateModel<Pagination<CardGroupModel>>;

const INITIAL_STATE: StateModel<Pagination<CardGroupModel>> = {error: null, loading: false};

export function cardGroupReducer(state: CardGroupState = INITIAL_STATE, action: Action): CardGroupState {
  switch (action.type) {
    case cardGroupActions.CARD_GROUPS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case cardGroupActions.CARD_GROUPS_GET:
      return {data: action.payload, error: null, loading: false};

    case cardGroupActions.CARD_GROUPS_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { CardGroupModel } from '../models/card-group.model';

export const cardGroupDetailActions = {
  CARD_GROUP_DETAIL_GET_REQUEST: 'CARD_GROUP_DETAIL_GET_REQUEST',
  CARD_GROUP_DETAIL_GET: 'CARD_GROUP_DETAIL_GET',
  CARD_GROUP_DETAIL_GET_FAIL: 'CARD_GROUP_DETAIL_GET_FAIL',
  CARD_GROUP_DETAIL_PUT_REQUEST: 'CARD_GROUP_DETAIL_PUT_REQUEST',
  CARD_GROUP_DETAIL_PUT: 'CARD_GROUP_DETAIL_PUT',
  CARD_GROUP_DETAIL_PUT_FAIL: 'CARD_GROUP_DETAIL_PUT_FAIL',
};

const INITIAL_STATE: StateModel<CardGroupModel> = {error: null, loading: false};

export function cardGroupDetailReducer(state: StateModel<CardGroupModel> = INITIAL_STATE, action: Action): StateModel<CardGroupModel> {
  switch (action.type) {
    case cardGroupDetailActions.CARD_GROUP_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case cardGroupDetailActions.CARD_GROUP_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case cardGroupDetailActions.CARD_GROUP_DETAIL_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    case cardGroupDetailActions.CARD_GROUP_DETAIL_PUT_REQUEST:
      return {data: state.data, error: null, loading: true};

    case cardGroupDetailActions.CARD_GROUP_DETAIL_PUT:
      return {data: action.payload, error: null, loading: false};

    case cardGroupDetailActions.CARD_GROUP_DETAIL_PUT_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

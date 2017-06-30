import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { CardDetailModel } from '../models/card-detail.model';

export const cardDetailActions = {
  CARD_DETAIL_GET_REQUEST: 'CARD_DETAIL_GET_REQUEST',
  CARD_DETAIL_GET: 'CARD_DETAIL_GET',
  CARD_DETAIL_GET_FAIL: 'CARD_DETAIL_GET_FAIL',
};

const INITIAL_STATE: StateModel<CardDetailModel> = {error: null, loading: false};

export function cardDetailReducer(state: StateModel<CardDetailModel> = INITIAL_STATE, action: Action): StateModel<CardDetailModel> {
  switch (action.type) {
    case cardDetailActions.CARD_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case cardDetailActions.CARD_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case cardDetailActions.CARD_DETAIL_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Pagination } from '../models/pagination.model';
import { CardRequestModel } from '../models/card-request.model';

export const cardRequestActions = {
  CARD_REQUEST_GET_REQUEST: 'CARD_REQUEST_GET_REQUEST',
  CARD_REQUEST_GET: 'CARD_REQUEST_GET',
  CARD_REQUEST_GET_FAIL: 'CARD_REQUEST_GET_FAIL'
};

const INITIAL_STATE: StateModel<Pagination<CardRequestModel>> = {error: null, loading: false};

export function cardRequestReducer(state: StateModel<Pagination<CardRequestModel>> = INITIAL_STATE,
                                   action: Action): StateModel<Pagination<CardRequestModel>> {
  switch (action.type) {
    case cardRequestActions.CARD_REQUEST_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case cardRequestActions.CARD_REQUEST_GET:
      return {data: action.payload, error: null, loading: false};

    case cardRequestActions.CARD_REQUEST_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

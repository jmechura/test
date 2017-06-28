import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { CardGroupCodeModel } from '../models/card-groups-code.model';

export const cardGroupCodeActions = {
  CARD_GROUP_CODE_GET_REQUEST: 'CARD_GROUP_CODE_GET_REQUEST',
  CARD_GROUP_CODE_GET: 'CARD_GROUP_CODE_GET',
  CARD_GROUP_CODE_GET_FAIL: 'CARD_GROUP_CODE_GET_FAIL'
};

const INITIAL_STATE: StateModel<CardGroupCodeModel[]> = {error: null, loading: false};

export function cardGroupCodeReducer(state: StateModel<CardGroupCodeModel[]> = INITIAL_STATE,
                                     action: Action): StateModel<CardGroupCodeModel[]> {
  switch (action.type) {
    case cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case cardGroupCodeActions.CARD_GROUP_CODE_GET:
      return {data: action.payload, error: null, loading: false};

    case cardGroupCodeActions.CARD_GROUP_CODE_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

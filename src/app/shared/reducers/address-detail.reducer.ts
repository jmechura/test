import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { AddressModel } from '../models/address.model';

export const addressDetailActions = {
  ADDRESS_DETAIL_GET_REQUEST: 'ADDRESS_DETAIL_GET_REQUEST',
  ADDRESS_DETAIL_GET: 'ADDRESS_DETAIL_GET',
  ADDRESS_DETAIL_GET_FAIL: 'ADDRESS_DETAIL_GET_FAIL',
};

const INITIAL_STATE: StateModel<AddressModel> = {error: null, loading: false};

export function addressDetailReducer(state: StateModel<AddressModel> = INITIAL_STATE,
                                     action: Action): StateModel<AddressModel> {
  switch (action.type) {
    case addressDetailActions.ADDRESS_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case addressDetailActions.ADDRESS_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case addressDetailActions.ADDRESS_DETAIL_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

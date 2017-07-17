import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const countryCodeActions = {
  COUNTRY_CODE_GET_REQUEST: 'COUNTRY_CODE_GET_REQUEST',
  COUNTRY_CODE_GET: 'COUNTRY_CODE_GET',
  COUNTRY_CODE_GET_FAIL: 'COUNTRY_CODE_GET_FAIL'
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function countryCodeReducer(state: StateModel<string[]> = INITIAL_STATE,
                                   action: Action): StateModel<string[]> {
  switch (action.type) {
    case countryCodeActions.COUNTRY_CODE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case countryCodeActions.COUNTRY_CODE_GET:
      return {data: action.payload, error: null, loading: false};

    case countryCodeActions.COUNTRY_CODE_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

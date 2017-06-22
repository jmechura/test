import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const transactionCodesActions = {
  CODES_GET: 'CODES_GET',
  CODES_FAILURE: 'CODES_FAILURE',
  CODES_SUCCESS: 'CODES_SUCCESS'
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function transactionCodeReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case transactionCodesActions.CODES_GET:
      return {data: state.data, error: null, loading: true};

    case transactionCodesActions.CODES_SUCCESS:
      return {data: action.payload, error: null, loading: false};

    case transactionCodesActions.CODES_FAILURE:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

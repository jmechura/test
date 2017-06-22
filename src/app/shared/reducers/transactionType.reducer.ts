import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const transactionTypesActions = {
  TYPES_GET: 'TYPES_GET',
  TYPES_FAILURE: 'TYPES_FAILURE',
  TYPES_SUCCESS: 'TYPES_SUCCESS'
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function transactionTypeReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case transactionTypesActions.TYPES_GET:
      return {data: state.data, error: null, loading: true};

    case transactionTypesActions.TYPES_SUCCESS:
      return {data: action.payload, error: null, loading: false};

    case transactionTypesActions.TYPES_FAILURE:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

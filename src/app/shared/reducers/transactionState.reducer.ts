import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const transactionStatesActions = {
  STATES_GET: 'STATES_GET',
  STATES_FAILURE: 'STATES_FAILURE',
  STATES_SUCCESS: 'STATES_SUCCESS'
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function transactionStateReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case transactionStatesActions.STATES_GET:
      return {data: state.data, error: null, loading: true};

    case transactionStatesActions.STATES_SUCCESS:
      return {data: action.payload, error: null, loading: false};

    case transactionStatesActions.STATES_FAILURE:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

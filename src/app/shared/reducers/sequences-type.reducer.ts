import { Action } from '@ngrx/store';
import { StateModel } from '../models/state.model';

export const sequencesTypeActions = {
  SEQUENCES_TYPE_API_GET: 'SEQUENCES_TYPE_API_GET',
  SEQUENCES_TYPE_GET: 'SEQUENCES_TYPE_GET',
  SEQUENCES_TYPE_GET_FAIL: 'SEQUENCES_TYPE_GET_FAIL',
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function sequencesTypeReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case sequencesTypeActions.SEQUENCES_TYPE_API_GET:
      return {data: state.data, error: null, loading: true};

    case sequencesTypeActions.SEQUENCES_TYPE_GET:
      return {data: action.payload, error: null, loading: false};

    case sequencesTypeActions.SEQUENCES_TYPE_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

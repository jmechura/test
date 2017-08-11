import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { SequencesModel } from '../models/sequences.model';

export const sequencesDetailActions = {
  SEQUENCES_DETAIL_GET_REQUEST: 'SEQUENCES_DETAIL_GET_REQUEST',
  SEQUENCES_DETAIL_GET: 'SEQUENCES_DETAIL_GET',
  SEQUENCES_DETAIL_GET_FAIL: 'SEQUENCES_DETAIL_GET_FAIL',
  SEQUENCES_DETAIL_PUT_REQUEST: 'SEQUENCES_DETAIL_PUT_REQUEST',
  SEQUENCES_DETAIL_PUT: 'SEQUENCES_DETAIL_PUT',
  SEQUENCES_DETAIL_PUT_FAIL: 'SEQUENCES_DETAIL_PUT_FAIL',
};

const INITIAL_STATE: StateModel<SequencesModel> = {error: null, loading: false};

export function sequencesDetailReducer(state: StateModel<SequencesModel> = INITIAL_STATE,
                                       action: Action): StateModel<SequencesModel> {
  switch (action.type) {
    case sequencesDetailActions.SEQUENCES_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case sequencesDetailActions.SEQUENCES_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case sequencesDetailActions.SEQUENCES_DETAIL_GET_FAIL:
      return {error: action.payload, loading: false};

    case sequencesDetailActions.SEQUENCES_DETAIL_PUT_REQUEST:
      return {data: state.data, error: null, loading: true};

    case sequencesDetailActions.SEQUENCES_DETAIL_PUT:
      return {data: action.payload, error: null, loading: false};

    case sequencesDetailActions.SEQUENCES_DETAIL_PUT_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}
